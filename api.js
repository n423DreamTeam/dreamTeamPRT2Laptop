import http from "http";
import https from "https";
import url from "url";

const PORT = 3001;

const API_KEY =
  process.env.BDL_API_KEY || "829461bf-d03d-43cd-840f-8d44e3f2a8bb";
const BASE_API = "https://api.balldontlie.io/v1";

function makeRequest(apiUrl, options = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const attemptRequest = (retriesLeft) => {
      const req = https.get(
        apiUrl,
        {
          headers: {
            Authorization: API_KEY.startsWith("Bearer ") ? API_KEY : API_KEY,
            "User-Agent": "DreamTeam/1.0",
            Accept: "application/json",
            ...options.headers,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (res.statusCode === 429 && retriesLeft > 0) {
              const backoff = 500 * Math.pow(2, 3 - retriesLeft); // 500ms, 1000ms, 2000ms
              console.log(
                `⚠️ Received 429, backing off ${backoff}ms and retrying (${
                  retriesLeft - 1
                } tries left)`
              );
              setTimeout(() => attemptRequest(retriesLeft - 1), backoff);
              return;
            }

            let parsed = data;
            try {
              parsed = JSON.parse(data);
            } catch (e) {}
            if (res.statusCode !== 200) {
              console.log(`🔍 Upstream ${res.statusCode} ${apiUrl}`);
              if (typeof parsed === "object") {
                console.log(
                  "🔍 Body snippet:",
                  JSON.stringify(parsed).slice(0, 300)
                );
              } else {
                console.log("🔍 Body raw:", String(parsed).slice(0, 300));
              }
            }
            resolve({ status: res.statusCode, data: parsed });
          });
        }
      );

      req.on("error", (err) => {
        if (retriesLeft > 0) {
          console.log(`⏳ Retrying... (${retriesLeft} attempts left)`);
          setTimeout(() => attemptRequest(retriesLeft - 1), 1000);
        } else {
          reject(err);
        }
      });
    };

    attemptRequest(retries);
  });
}

const cache = new Map();

function setCache(key, data, ttl = 1000 * 60 * 5) {
  const expires = Date.now() + ttl;
  cache.set(key, { data, expires });
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

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  try {
    if (pathname === "/api/players") {
      const teamId = query.team_id || 12;
      const cacheKey = `players:${teamId}`;
      const cached = getCache(cacheKey);
      if (cached) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cached));
        return;
      }

      const apiUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const result = await makeRequest(apiUrl);
      if (result && result.status === 200) {
        try {
          setCache(cacheKey, result.data, 1000 * 60 * 5);
        } catch (e) {}
      }

      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.data));
    } else if (pathname === "/api/stats") {
      const season = query.season || 2024;
      const playerIds = query.player_ids ? query.player_ids.split(",") : [];

      if (!playerIds.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No player_ids provided" }));
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const playerIdParams = playerIds
        .map((id) => `player_ids[]=${id}`)
        .join("&");
      const apiUrl = `${BASE_API}/season_averages?season=${season}&${playerIdParams}`;
      console.log(`📡 Fetching stats from: ${apiUrl.substring(0, 100)}...`);
      const result = await makeRequest(apiUrl);
      console.log(`📦 Response status: ${result.status}`);
      if (result.status !== 200) {
        console.log(`⚠️ Response data:`, result.data);
      }
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.data));
    } else if (pathname === "/api/daily") {
      const season = query.season || 2024;
      const teamId = query.team_id || 12;
      const todayKey = new Date().toISOString().split("T")[0];
      const cacheKey = `daily:${teamId}:${season}:${todayKey}`;
      const forceRefresh = query.refresh === "1" || query.nocache === "1";
      const cached = getCache(cacheKey);

      if (cached && !forceRefresh) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cached));
        return;
      }

      console.log(
        `🔄 ${
          forceRefresh ? "REFRESH" : "Initial"
        } fetch - pulling fresh data...`
      );

      const playersUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const playersResult = await makeRequest(playersUrl);
      let players = [];
      let rateLimited = false;
      if (playersResult.status === 200) {
        players = playersResult.data.data || [];
        console.log(`✅ Fetched ${players.length} players from API`);
      } else if (playersResult.status === 429) {
        rateLimited = true;
        if (cached) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ...cached, rateLimited }));
          return;
        }
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
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ ...cached, upstreamError: playersResult.status })
          );
          return;
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
      const playerIds = players.map((p) => p.id);
      const idParams = playerIds.map((id) => `player_ids[]=${id}`).join("&");
      const statsUrl = `${BASE_API}/season_averages?season=${season}&${idParams}`;
      const statsResult = await makeRequest(statsUrl);

      let fallback = false;
      let merged = [];
      if (statsResult.status === 200 && Array.isArray(statsResult.data.data)) {
        const statsMap = new Map(
          statsResult.data.data.map((s) => [s.player_id, s])
        );
        merged = players
          .map((p) => {
            const stat = statsMap.get(p.id);
            if (!stat) {
              return {
                id: p.id,
                name: `${p.first_name} ${p.last_name}`,
                pts: p.position === "G" ? 8.0 : 6.0,
                ast: p.position === "G" ? 2.0 : 1.0,
              };
            }
            return {
              id: p.id,
              name: `${p.first_name} ${p.last_name}`,
              pts: stat.pts || 0,
              ast: stat.ast || 0,
            };
          })
          .filter(Boolean); // Only filter out null/undefined, not zero-stat players
      }
      if (!merged.length) {
        fallback = true;
        merged = players.slice(0, 12).map((p) => {
          let pts = 10 + Math.random() * 12;
          let ast =
            p.position === "G" ? 3 + Math.random() * 5 : 1 + Math.random() * 3;
          return {
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            pts: parseFloat(pts.toFixed(1)),
            ast: parseFloat(ast.toFixed(1)),
          };
        });
      }

      // Use only current API players (no hard-coded legends)
      const sorted = merged.sort((a, b) => b.pts - a.pts);
      console.log(`📊 API players available: ${sorted.length}`);
      function sample(arr, n) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
      }
      let pool;
      let goalPoints;
      let goalAssists;

      if (forceRefresh && cached) {
        pool = sample(sorted, 5);
        console.log(
          `🎲 Refreshed players: ${pool.map((p) => p.name).join(", ")}`
        );
        goalPoints = cached.goals.points;
        goalAssists = cached.goals.assists;
      } else {
        pool = sorted.slice(0, 12);
        console.log(`⭐ Initial top 12: ${pool.map((p) => p.name).join(", ")}`);
        const totalPoints = pool.reduce((s, p) => s + p.pts, 0);
        const totalAssists = pool.reduce((s, p) => s + p.ast, 0);

        goalPoints = Math.max(1, Math.round(totalPoints * 0.9));
        goalAssists = Math.max(1, Math.round(totalAssists * 0.9));
      }

      function ensureInPool(name) {
        const idx = sorted.findIndex((p) => p.name.toLowerCase() === name);
        if (idx !== -1 && !pool.some((p) => p.name.toLowerCase() === name)) {
          pool.push(sorted[idx]);
        }
      }
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
        goals: { points: goalPoints, assists: goalAssists },
        players: pool.map((p) => ({
          id: p.id,
          name: p.name,
          pts: p.pts,
          ast: p.ast,
        })),
        rateLimited,
      };
      if (!forceRefresh) setCache(cacheKey, payload, 1000 * 60 * 10); // 10 min cache only for base daily
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } catch (err) {
    console.error("❌ Error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
