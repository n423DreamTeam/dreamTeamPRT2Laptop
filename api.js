import http from "http";
import https from "https";
import url from "url";

const PORT = 3001;

// Ball Don't Lie API
const BDL_API_KEY =
  process.env.BDL_API_KEY || "829461bf-d03d-43cd-840f-8d44e3f2a8bb";
const BDL_BASE_API = "https://api.balldontlie.io/v1";
const PACERS_TEAM_ID = 12; // Ball Don't Lie team ID for Pacers

function makeRequest(apiUrl, options = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const attemptRequest = (retriesLeft) => {
      const req = https.get(
        apiUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json, text/plain, */*",
            Authorization: BDL_API_KEY,
            ...options.headers,
          },
          timeout: 8000, // 8 second timeout per request
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (res.statusCode === 429 && retriesLeft > 0) {
              const backoff = 500 * Math.pow(2, 3 - retriesLeft);
              console.log(
                `⚠️ Rate limited, backing off ${backoff}ms (${
                  retriesLeft - 1
                } retries left)`
              );
              setTimeout(() => attemptRequest(retriesLeft - 1), backoff);
              return;
            }

            let parsed = data;
            try {
              parsed = JSON.parse(data);
            } catch (e) {}

            if (res.statusCode !== 200) {
              console.log(`🔍 HTTP ${res.statusCode}`);
            }
            resolve({ status: res.statusCode, data: parsed });
          });
        }
      );

      req.on("error", (err) => {
        if (retriesLeft > 0) {
          console.log(`⏳ Error, retrying... (${retriesLeft} attempts left)`);
          setTimeout(() => attemptRequest(retriesLeft - 1), 1000);
        } else {
          reject(err);
        }
      });

      req.on("timeout", () => {
        req.destroy();
        if (retriesLeft > 0) {
          console.log(`⏱️ Timeout, retrying... (${retriesLeft} attempts left)`);
          setTimeout(() => attemptRequest(retriesLeft - 1), 1000);
        } else {
          reject(new Error("Request timeout"));
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
      console.log("📍 /api/players endpoint");
      const cacheKey = "players:pacers";
      const cached = getCache(cacheKey);

      if (cached) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cached));
        return;
      }

      const playersUrl = `${BDL_BASE_API}/players?team_ids[]=${PACERS_TEAM_ID}&per_page=100`;
      const result = await makeRequest(playersUrl);

      if (result.status === 200 && result.data?.data) {
        setCache(cacheKey, result.data, 1000 * 60 * 10);
      }

      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.data || {}));
    } else if (pathname === "/api/stats") {
      console.log("📍 /api/stats endpoint");
      const season = query.season || 2024;
      const playerIds = query.player_ids ? query.player_ids.split(",") : [];

      if (!playerIds.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No player_ids provided" }));
        return;
      }

      const idParams = playerIds.map((id) => `player_ids[]=${id}`).join("&");
      const statsUrl = `${BDL_BASE_API}/season_averages?season=${season}&${idParams}`;
      const result = await makeRequest(statsUrl);

      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.data || {}));
    } else if (pathname === "/api/daily") {
      console.log("📍 /api/daily endpoint");
      const season = query.season || 2023; // Ball Don't Lie's most recent data
      const todayKey = new Date().toISOString().split("T")[0];
      const cacheKey = `daily:pacers:${season}:${todayKey}`;
      const forceRefresh = query.refresh === "1" || query.nocache === "1";
      const cached = getCache(cacheKey);

      if (cached && !forceRefresh) {
        console.log("✅ Returning cached daily challenge");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cached));
        return;
      }

      console.log(`🔄 Fetching fresh daily challenge (season ${season})...`);

      // Get all Pacers players
      const playersUrl = `${BDL_BASE_API}/players?team_ids[]=${PACERS_TEAM_ID}&per_page=100`;
      const playersResult = await makeRequest(playersUrl);

      if (playersResult.status !== 200 || !playersResult.data?.data?.length) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch players" }));
        return;
      }

      const allPlayers = playersResult.data.data;
      console.log(`✅ Got ${allPlayers.length} Pacers players`);

      // Get stats for all players
      const playerIds = allPlayers.map((p) => p.id);
      const idParams = playerIds.map((id) => `player_ids[]=${id}`).join("&");
      const statsUrl = `${BDL_BASE_API}/season_averages?season=${season}&${idParams}`;
      const statsResult = await makeRequest(statsUrl);

      let statsByPlayer = {};
      if (statsResult.status === 200 && statsResult.data?.data) {
        statsResult.data.data.forEach((stat) => {
          statsByPlayer[stat.player_id] = {
            pts: stat.pts || 0,
            ast: stat.ast || 0,
          };
        });
      }

      // Merge player data with stats
      const merged = allPlayers.map((p) => {
        const stats = statsByPlayer[p.id] || { pts: 0, ast: 0 };
        return {
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          pts: stats.pts,
          ast: stats.ast,
        };
      });

      // Filter out players with no stats (0 points and 0 assists)
      const playersWithStats = merged.filter((p) => p.pts > 0 || p.ast > 0);
      const sorted = playersWithStats.sort((a, b) => b.pts - a.pts);
      console.log(`📊 Total players with stats: ${sorted.length}`);

      // Sample function
      function sample(arr, n) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
      }

      // Calculate goals based on top 5 players
      const top5 = sorted.slice(0, 5);
      const totalPoints = top5.reduce((s, p) => s + p.pts, 0);
      const totalAssists = top5.reduce((s, p) => s + p.ast, 0);

      const goalPoints = Math.max(1, Math.round(totalPoints * 0.8));
      const goalAssists = Math.max(1, Math.round(totalAssists * 0.8));

      // Sample 5 random players
      const pool = sample(sorted, Math.min(5, sorted.length));

      const payload = {
        date: todayKey,
        season,
        source: "balldontlie",
        goals: { points: goalPoints, assists: goalAssists },
        players: pool.map((p) => ({
          id: p.id,
          name: p.name,
          pts: parseFloat(p.pts.toFixed(1)),
          ast: parseFloat(p.ast.toFixed(1)),
        })),
      };

      setCache(cacheKey, payload, 1000 * 60 * 10);
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
  console.log(`📊 Using Ball Don't Lie API exclusively`);
});
