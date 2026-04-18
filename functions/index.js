const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const https = require("https");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

// Use 2nd gen with fixed region
setGlobalOptions({ region: "us-central1" });

// -----------------------------
// Config
// -----------------------------
const API_KEY =
  process.env.BDL_API_KEY || "829461bf-d03d-43cd-840f-8d44e3f2a8bb";
const BASE_API = "https://api.balldontlie.io/v1";

// -----------------------------
// HTTP Request Helper
// -----------------------------
function makeRequest(apiUrl, options = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (left) => {
      const req = https.get(
        apiUrl,
        {
          headers: {
            Authorization: API_KEY,
            "User-Agent": "DreamTeam/1.0",
            Accept: "application/json",
            ...options.headers,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (res.statusCode === 429 && left > 0) {
              const backoff = 500 * Math.pow(2, 3 - left);
              return setTimeout(() => attempt(left - 1), backoff);
            }

            let parsed = data;
            try {
              parsed = JSON.parse(data);
            } catch {}

            resolve({ status: res.statusCode, data: parsed });
          });
        }
      );

      req.on("error", (err) => {
        if (left > 0) {
          return setTimeout(() => attempt(left - 1), 1000);
        }
        reject(err);
      });
    };

    attempt(retries);
  });
}

// -----------------------------
// Cache system
// -----------------------------
const cache = new Map();

function setCache(key, data, ttl = 1000 * 60 * 5) {
  cache.set(key, { data, expires: Date.now() + ttl });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

// -----------------------------
// JSON Response Helper (CORS)
// -----------------------------
function sendJson(res, status, body) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(body);
}

function sendPushJson(res, status, body) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Admin-Key, Authorization"
  );
  res.status(status).json(body);
}

function sendAuthJson(res, status, body) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(status).json(body);
}

function getRemovableTokenErrors() {
  return new Set([
    "messaging/registration-token-not-registered",
    "messaging/invalid-registration-token",
    "messaging/invalid-argument",
  ]);
}

function getBearerToken(req) {
  const authHeader = req.get("authorization") || "";
  const prefix = "bearer ";
  if (!authHeader.toLowerCase().startsWith(prefix)) return null;
  return authHeader.slice(prefix.length).trim();
}

async function verifyRequestAuth(req) {
  const token = getBearerToken(req);
  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }
  return admin.auth().verifyIdToken(token);
}

function isAdminEmail(email) {
  const allowed = String(process.env.PUSH_ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.length) return false;
  return allowed.includes(String(email || "").toLowerCase());
}

// -----------------------------
// MAIN API FUNCTION
// -----------------------------
exports.api = onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, {});
  }

  try {
    const pathname = req.path.replace(/^\/+api\/?/, "/");
    const query = req.query || {};

    // -------------------------
    // /players
    // -------------------------
    if (pathname === "/players") {
      const teamId = query.team_id || 12;
      const cacheKey = `players:${teamId}`;

      const cached = getCache(cacheKey);
      if (cached) return sendJson(res, 200, cached);

      const apiUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const result = await makeRequest(apiUrl);

      if (result.status === 200) {
        setCache(cacheKey, result.data);
      }

      return sendJson(res, result.status, result.data);
    }

    // -------------------------
    // /stats
    // -------------------------
    if (pathname === "/stats") {
      const season = query.season || 2024;
      const playerIds = query.player_ids
        ? String(query.player_ids).split(",")
        : [];

      if (!playerIds.length) {
        return sendJson(res, 400, { error: "No player_ids provided" });
      }

      const playerIdParams = playerIds
        .map((id) => `player_ids[]=${id}`)
        .join("&");

      const url = `${BASE_API}/season_averages?season=${season}&${playerIdParams}`;
      const result = await makeRequest(url);

      return sendJson(res, result.status, result.data);
    }

    // -------------------------
    // /daily
    // -------------------------
    if (pathname === "/daily") {
      const season = query.season || 2024;
      const teamId = query.team_id || 12;
      const todayKey = new Date().toISOString().split("T")[0];

      const cacheKey = `daily:${teamId}:${season}:${todayKey}`;
      const forceRefresh = query.refresh === "1" || query.nocache === "1";

      const cached = getCache(cacheKey);
      if (cached && !forceRefresh) {
        return sendJson(res, 200, cached);
      }

      // Fetch players
      const playersUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const playersResult = await makeRequest(playersUrl);

      let players = [];
      let rateLimited = false;

      if (playersResult.status === 200) {
        players = playersResult.data.data || [];
      } else if (playersResult.status === 429) {
        rateLimited = true;

        if (cached) {
          return sendJson(res, 200, { ...cached, rateLimited });
        }

        // fallback players
        players = [
          {
            id: 1,
            first_name: "Tyrese",
            last_name: "Haliburton",
            position: "G",
          },
          { id: 2, first_name: "Andrew", last_name: "Nembhard", position: "G" },
          { id: 3, first_name: "Pascal", last_name: "Siakam", position: "F" },
          { id: 4, first_name: "Obi", last_name: "Toppin", position: "F" },
          {
            id: 5,
            first_name: "Bennedict",
            last_name: "Mathurin",
            position: "G",
          },
          { id: 6, first_name: "TJ", last_name: "McConnell", position: "G" },
          { id: 7, first_name: "Isaiah", last_name: "Jackson", position: "C" },
        ];
      } else {
        if (cached) {
          return sendJson(res, 200, {
            ...cached,
            upstreamError: playersResult.status,
          });
        }

        players = [
          {
            id: 101,
            first_name: "Fallback",
            last_name: "Player1",
            position: "G",
          },
          {
            id: 102,
            first_name: "Fallback",
            last_name: "Player2",
            position: "F",
          },
          {
            id: 103,
            first_name: "Fallback",
            last_name: "Player3",
            position: "C",
          },
          {
            id: 104,
            first_name: "Fallback",
            last_name: "Player4",
            position: "G",
          },
          {
            id: 105,
            first_name: "Fallback",
            last_name: "Player5",
            position: "F",
          },
        ];
      }

      // Stats
      const playerIds = players.map((p) => p.id);
      const idParams = playerIds.map((id) => `player_ids[]=${id}`).join("&");

      const statsUrl = `${BASE_API}/season_averages?season=${season}&${idParams}`;
      const statsResult = await makeRequest(statsUrl);

      let merged = [];
      let fallback = false;

      if (statsResult.status === 200 && Array.isArray(statsResult.data.data)) {
        const statsMap = new Map(
          statsResult.data.data.map((s) => [s.player_id, s])
        );

        merged = players.map((p) => {
          const stat = statsMap.get(p.id);
          if (!stat) {
            return {
              id: p.id,
              name: `${p.first_name} ${p.last_name}`,
              pts: p.position === "G" ? 8 : 6,
              ast: p.position === "G" ? 2 : 1,
            };
          }

          return {
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            pts: stat.pts || 0,
            ast: stat.ast || 0,
          };
        });
      }

      if (!merged.length) {
        fallback = true;

        merged = players.slice(0, 12).map((p) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          pts: Number((10 + Math.random() * 12).toFixed(1)),
          ast: Number(
            (
              (p.position === "G" ? 3 : 1) +
              Math.random() * (p.position === "G" ? 5 : 3)
            ).toFixed(1)
          ),
        }));
      }

      const sorted = merged.sort((a, b) => b.pts - a.pts);

      const sample = (arr, n) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
      };

      let pool;
      let goalPoints;
      let goalAssists;

      if (forceRefresh && cached) {
        pool = sample(sorted, 5);
        goalPoints = cached.goals.points;
        goalAssists = cached.goals.assists;
      } else {
        pool = sorted.slice(0, 12);
        const totalPoints = pool.reduce((s, p) => s + p.pts, 0);
        const totalAssists = pool.reduce((s, p) => s + p.ast, 0);

        goalPoints = Math.max(1, Math.round(totalPoints * 0.9));
        goalAssists = Math.max(1, Math.round(totalAssists * 0.9));
      }

      const ensureInPool = (name) => {
        const idx = sorted.findIndex((p) => p.name.toLowerCase() === name);
        if (idx !== -1 && !pool.some((p) => p.name.toLowerCase() === name)) {
          pool.push(sorted[idx]);
        }
      };

      ensureInPool("tyrese haliburton");
      ensureInPool("andrew nembhard");
      ensureInPool("pascal siakam");
      ensureInPool("tj mcconnell");
      ensureInPool("bennedict mathurin");
      ensureInPool("aaron nesmith");

      pool = sample(pool, Math.min(12, pool.length));

      const payload = {
        date: todayKey,
        season,
        teamId,
        fallback,
        refreshed: forceRefresh,
        goalsLocked: !!(forceRefresh && cached),
        goals: {
          points: goalPoints,
          assists: goalAssists,
        },
        players: pool.map((p) => ({
          id: p.id,
          name: p.name,
          pts: p.pts,
          ast: p.ast,
        })),
        rateLimited,
      };

      if (!forceRefresh) {
        setCache(cacheKey, payload, 1000 * 60 * 10);
      }

      return sendJson(res, 200, payload);
    }

    // No match
    return sendJson(res, 404, { error: "Route not found" });
  } catch (err) {
    return sendJson(res, 500, { error: err?.message || String(err) });
  }
});

exports.sendPush = onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendPushJson(res, 200, {});
  }

  if (req.method !== "POST") {
    return sendPushJson(res, 405, { error: "Method not allowed" });
  }

  const adminKey = process.env.PUSH_ADMIN_KEY;
  const providedKey = req.get("x-admin-key");
  if (!adminKey || providedKey !== adminKey) {
    return sendPushJson(res, 403, { error: "Forbidden" });
  }

  const uid = String(req.body?.uid || "").trim();
  const title = String(req.body?.title || "DreamTeam Update").trim();
  const body = String(req.body?.body || "You have a new update.").trim();
  const rawData = req.body?.data && typeof req.body.data === "object"
    ? req.body.data
    : {};

  if (!uid) {
    return sendPushJson(res, 400, { error: "uid is required" });
  }

  try {
    const userRef = admin.firestore().doc(`users/${uid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return sendPushJson(res, 404, { error: "User not found" });
    }

    const userData = userSnap.data() || {};
    const tokens = Array.isArray(userData.fcmTokens)
      ? userData.fcmTokens.filter((token) => typeof token === "string" && token.length > 20)
      : [];

    if (!tokens.length) {
      return sendPushJson(res, 400, { error: "No registered push tokens for this user" });
    }

    const message = {
      tokens,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, String(value)])
      ),
    };

    const result = await admin.messaging().sendEachForMulticast(message);

    const removableErrors = getRemovableTokenErrors();
    const invalidTokens = [];
    result.responses.forEach((response, index) => {
      if (!response.success) {
        const code = response.error?.code || "";
        if (removableErrors.has(code)) {
          invalidTokens.push(tokens[index]);
        }
      }
    });

    if (invalidTokens.length) {
      const cleaned = tokens.filter((token) => !invalidTokens.includes(token));
      await userRef.set(
        {
          fcmTokens: cleaned,
          pushUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    return sendPushJson(res, 200, {
      successCount: result.successCount,
      failureCount: result.failureCount,
      prunedTokens: invalidTokens.length,
    });
  } catch (error) {
    console.error("sendPush failed", error);
    return sendPushJson(res, 500, { error: "Push send failed" });
  }
});

exports.registerPushToken = onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendAuthJson(res, 200, {});
  }

  if (req.method !== "POST") {
    return sendAuthJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const decoded = await verifyRequestAuth(req);
    const token = String(req.body?.token || "").trim();

    if (!token || token.length < 20) {
      return sendAuthJson(res, 400, { error: "token is required" });
    }

    const userRef = admin.firestore().doc(`users/${decoded.uid}`);
    await userRef.set(
      {
        pushPermission: "granted",
        pushEnabled: true,
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
        pushTokenPending: admin.firestore.FieldValue.delete(),
        pushUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return sendAuthJson(res, 200, { ok: true });
  } catch (error) {
    if (error?.message === "UNAUTHENTICATED") {
      return sendAuthJson(res, 401, { error: "Unauthenticated" });
    }
    console.error("registerPushToken failed", error);
    return sendAuthJson(res, 500, { error: "Push token registration failed" });
  }
});

exports.adminSendPushTest = onRequest(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendAuthJson(res, 200, {});
  }

  if (req.method !== "POST") {
    return sendAuthJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const decoded = await verifyRequestAuth(req);
    if (!isAdminEmail(decoded.email)) {
      return sendAuthJson(res, 403, { error: "Admin access required" });
    }

    const targetUid = String(req.body?.uid || decoded.uid).trim();
    const title = String(req.body?.title || "DreamTeam Test").trim();
    const body = String(req.body?.body || "Push test notification.").trim();
    const rawData = req.body?.data && typeof req.body.data === "object"
      ? req.body.data
      : {};

    const userRef = admin.firestore().doc(`users/${targetUid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return sendAuthJson(res, 404, { error: "User not found" });
    }

    const userData = userSnap.data() || {};
    const tokens = Array.isArray(userData.fcmTokens)
      ? userData.fcmTokens.filter((token) => typeof token === "string" && token.length > 20)
      : [];

    const pendingToken = typeof userData.pushTokenPending === "string" && userData.pushTokenPending.length > 20
      ? userData.pushTokenPending
      : "";

    if (!tokens.length && pendingToken) {
      tokens.push(pendingToken);
      await userRef.set(
        {
          fcmTokens: admin.firestore.FieldValue.arrayUnion(pendingToken),
          pushEnabled: true,
          pushTokenPending: admin.firestore.FieldValue.delete(),
          pushUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    if (!tokens.length) {
      return sendAuthJson(res, 400, { error: "No registered push tokens for this user" });
    }

    const result = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, String(value)])
      ),
    });

    const removableErrors = getRemovableTokenErrors();
    const invalidTokens = [];
    result.responses.forEach((response, index) => {
      if (!response.success) {
        const code = response.error?.code || "";
        if (removableErrors.has(code)) {
          invalidTokens.push(tokens[index]);
        }
      }
    });

    if (invalidTokens.length) {
      const cleaned = tokens.filter((token) => !invalidTokens.includes(token));
      await userRef.set(
        {
          fcmTokens: cleaned,
          pushEnabled: cleaned.length > 0,
          pushUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    return sendAuthJson(res, 200, {
      successCount: result.successCount,
      failureCount: result.failureCount,
      prunedTokens: invalidTokens.length,
    });
  } catch (error) {
    if (error?.message === "UNAUTHENTICATED") {
      return sendAuthJson(res, 401, { error: "Unauthenticated" });
    }
    console.error("adminSendPushTest failed", error);
    return sendAuthJson(res, 500, { error: "Push send failed" });
  }
});

exports.sendDailyChallengePush = onSchedule(
  {
    schedule: "0 11 * * *",
    timeZone: "America/Indiana/Indianapolis",
  },
  async () => {
    try {
      const usersSnap = await admin
        .firestore()
        .collection("users")
        .where("pushPermission", "==", "granted")
        .get();

      let targetedUsers = 0;
      let sent = 0;
      let failed = 0;

      const removableErrors = getRemovableTokenErrors();

      for (const userDoc of usersSnap.docs) {
        const data = userDoc.data() || {};
        const tokens = Array.isArray(data.fcmTokens)
          ? data.fcmTokens.filter((token) => typeof token === "string" && token.length > 20)
          : [];

        if (!tokens.length) {
          continue;
        }

        targetedUsers += 1;

        const result = await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "New Daily Challenge is Live",
            body: "Set your lineup now and earn more DreamTeam points.",
          },
          data: {
            type: "daily-challenge",
            path: "/dashboard.html",
          },
        });

        sent += result.successCount;
        failed += result.failureCount;

        const invalidTokens = [];
        result.responses.forEach((response, index) => {
          if (!response.success) {
            const code = response.error?.code || "";
            if (removableErrors.has(code)) {
              invalidTokens.push(tokens[index]);
            }
          }
        });

        if (invalidTokens.length) {
          const cleaned = tokens.filter((token) => !invalidTokens.includes(token));
          await userDoc.ref.set(
            {
              fcmTokens: cleaned,
              pushEnabled: cleaned.length > 0,
              pushUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      }

      console.log("Daily push summary", {
        targetedUsers,
        sent,
        failed,
      });
    } catch (error) {
      console.error("sendDailyChallengePush failed", error);
    }
  }
);
