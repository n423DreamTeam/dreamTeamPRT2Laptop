// Simple Node.js API server to proxy Ball Don't Lie API
// Run this with: node api.js

import http from "http";
import https from "https";
import url from "url";

const PORT = 3001;

// Your Ball Don't Lie API credentials (get free at https://balldontlie.io/api)
// Prefer environment variable over hard-coded key
const API_KEY =
  process.env.BDL_API_KEY || "829461bf-d03d-43cd-840f-8d44e3f2a8bb"; // Replace with your actual key
const BASE_API = "https://api.balldontlie.io/v1";

// Pacers Legends & Notable Players Database (career averages or peak season stats)
const PACERS_LEGENDS = [
  // All-Time Greats
  { id: 9001, name: "Reggie Miller", pts: 18.2, ast: 3.0, position: "SG" },
  { id: 9002, name: "Paul George", pts: 17.4, ast: 3.3, position: "SF" },
  { id: 9003, name: "Victor Oladipo", pts: 17.9, ast: 4.0, position: "SG" },
  { id: 9004, name: "Jermaine O'Neal", pts: 13.2, ast: 1.3, position: "C" },
  { id: 9005, name: "Danny Granger", pts: 12.8, ast: 1.5, position: "SF" },
  { id: 9006, name: "Rik Smits", pts: 14.8, ast: 1.4, position: "C" },
  { id: 9007, name: "Mark Jackson", pts: 9.6, ast: 8.0, position: "PG" },
  { id: 9008, name: "Domantas Sabonis", pts: 18.9, ast: 5.0, position: "C" },

  // Notable Stars
  { id: 9009, name: "Roy Hibbert", pts: 9.2, ast: 0.8, position: "C" },
  { id: 9010, name: "Myles Turner", pts: 13.8, ast: 1.2, position: "C" },
  { id: 9011, name: "Malcolm Brogdon", pts: 15.6, ast: 4.2, position: "PG" },
  { id: 9012, name: "David West", pts: 11.8, ast: 2.1, position: "PF" },
  { id: 9013, name: "Lance Stephenson", pts: 8.6, ast: 2.9, position: "SG" },
  { id: 9014, name: "George Hill", pts: 8.4, ast: 2.9, position: "PG" },
  { id: 9015, name: "Darren Collison", pts: 9.5, ast: 4.0, position: "PG" },

  // Fan Favorites & Key Contributors
  { id: 9016, name: "Ron Artest", pts: 11.7, ast: 2.3, position: "SF" },
  { id: 9017, name: "Detlef Schrempf", pts: 14.0, ast: 3.0, position: "F" },
  { id: 9018, name: "Dale Davis", pts: 8.1, ast: 0.8, position: "PF" },
  { id: 9019, name: "Antonio Davis", pts: 9.3, ast: 1.1, position: "PF" },
  { id: 9020, name: "Jeff Foster", pts: 4.8, ast: 0.7, position: "PF" },
  { id: 9021, name: "Travis Best", pts: 8.2, ast: 3.4, position: "PG" },
  { id: 9022, name: "Jamaal Tinsley", pts: 8.8, ast: 5.8, position: "PG" },
  { id: 9023, name: "Troy Murphy", pts: 9.6, ast: 1.2, position: "PF" },
  { id: 9024, name: "Mike Dunleavy Jr", pts: 9.4, ast: 1.8, position: "SF" },
  { id: 9025, name: "Tyler Hansbrough", pts: 6.7, ast: 0.6, position: "PF" },
  { id: 9026, name: "Stephen Jackson", pts: 13.4, ast: 2.8, position: "SF" },
  { id: 9027, name: "Al Harrington", pts: 11.3, ast: 1.6, position: "PF" },
  { id: 9028, name: "Austin Croshere", pts: 6.9, ast: 1.0, position: "PF" },
  { id: 9029, name: "Thaddeus Young", pts: 10.2, ast: 1.6, position: "PF" },
  { id: 9030, name: "Bojan Bogdanovic", pts: 18.0, ast: 2.0, position: "SF" },
  { id: 9031, name: "T.J. Ford", pts: 10.7, ast: 5.7, position: "PG" },
  { id: 9032, name: "Caris LeVert", pts: 16.5, ast: 3.9, position: "SG" },
  { id: 9033, name: "Doug McDermott", pts: 9.4, ast: 0.8, position: "SF" },

  // ABA Era Legends
  { id: 9034, name: "Roger Brown", pts: 18.0, ast: 3.5, position: "SF" },
  { id: 9035, name: "Mel Daniels", pts: 18.7, ast: 2.3, position: "C" },
  { id: 9036, name: "George McGinnis", pts: 24.8, ast: 3.3, position: "PF" },
  { id: 9037, name: "Freddie Lewis", pts: 13.3, ast: 4.1, position: "PG" },
  { id: 9038, name: "Billy Knight", pts: 17.9, ast: 2.1, position: "SG" },

  // Current players that might not have API stats yet
  { id: 9050, name: "Johnny Furphy", pts: 5.5, ast: 0.8, position: "SF" },
  { id: 9051, name: "Jarace Walker", pts: 7.2, ast: 1.1, position: "PF" },
  { id: 9052, name: "Ben Sheppard", pts: 6.8, ast: 1.3, position: "SG" },
  { id: 9053, name: "Obi Toppin", pts: 10.3, ast: 1.5, position: "PF" },
  { id: 9054, name: "Aaron Nesmith", pts: 12.2, ast: 1.8, position: "SF" },
  { id: 9055, name: "TJ McConnell", pts: 7.8, ast: 4.5, position: "PG" },
  { id: 9056, name: "Isaiah Jackson", pts: 8.1, ast: 0.6, position: "C" },
  { id: 9057, name: "Bennedict Mathurin", pts: 14.5, ast: 2.0, position: "SG" },
  { id: 9058, name: "James Wiseman", pts: 7.0, ast: 0.5, position: "C" },
  { id: 9059, name: "Kendall Brown", pts: 3.2, ast: 0.4, position: "SF" },
];

// Helper to make HTTPS requests with retry logic
function makeRequest(apiUrl, options = {}, retries = 3) {
  return new Promise((resolve, reject) => {
    const attemptRequest = (retriesLeft) => {
      const req = https.get(
        apiUrl,
        {
          headers: {
            // Some versions of Ball Don't Lie expect raw key not Bearer.
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
            // If the external API responds with 429, attempt retry with backoff
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
            } catch (e) {
              /* keep raw */
            }
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

// Simple in-memory cache to reduce requests to the external API
const cache = new Map();

function setCache(key, data, ttl = 1000 * 60 * 5) {
  // default 5 minutes
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

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS
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
    // Route: GET /api/players?team_id=12
    if (pathname === "/api/players") {
      const teamId = query.team_id || 12;
      const cacheKey = `players:${teamId}`;
      const cached = getCache(cacheKey);
      if (cached) {
        // return cached copy
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(cached));
        return;
      }

      const apiUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const result = await makeRequest(apiUrl);
      // If successful, cache the response body for a short time
      if (result && result.status === 200) {
        try {
          setCache(cacheKey, result.data, 1000 * 60 * 5); // cache 5 minutes
        } catch (e) {
          // ignore cache set errors
        }
      }

      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.data));
    }

    // Route: GET /api/stats?season=2024
    else if (pathname === "/api/stats") {
      const season = query.season || 2024;
      const playerIds = query.player_ids ? query.player_ids.split(",") : [];

      if (!playerIds.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No player_ids provided" }));
        return;
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Build query string for multiple player IDs
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
    }

    // Route: GET /api/daily  -> returns player pool + computed goals
    else if (pathname === "/api/daily") {
      const season = query.season || 2024;
      const teamId = query.team_id || 12;
      const todayKey = new Date().toISOString().split("T")[0];
      const cacheKey = `daily:${teamId}:${season}:${todayKey}`;
      const forceRefresh = query.refresh === "1" || query.nocache === "1";
      const cached = getCache(cacheKey);

      // Don't use cache on refresh - always fetch fresh players
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

      // Fetch players
      const playersUrl = `${BASE_API}/players?team_ids[]=${teamId}&per_page=100`;
      const playersResult = await makeRequest(playersUrl);
      let players = [];
      let rateLimited = false;
      if (playersResult.status === 200) {
        players = playersResult.data.data || [];
        console.log(`✅ Fetched ${players.length} players from API`);
      } else if (playersResult.status === 429) {
        // Use cached payload if exists; otherwise synthetic fallback
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
        // Other error codes -> fallback synthetic roster
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
      const playerIds = players.map((p) => p.id); // get all players
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
            // Include all players, assign minimal stats if no season data
            if (!stat) {
              return {
                id: p.id,
                name: `${p.first_name} ${p.last_name}`,
                pts: p.position === "G" ? 8.0 : 6.0, // Guards get slightly higher default
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

      // Merge current players with Pacers legends
      const combinedPool = [...merged, ...PACERS_LEGENDS];

      console.log(`📊 Total players available: ${combinedPool.length}`);
      console.log(`   - From API: ${merged.length}`);
      console.log(`   - Legends: ${PACERS_LEGENDS.length}`);

      // Candidate pool (all players sorted by points)
      const sorted = combinedPool.sort((a, b) => b.pts - a.pts);
      function sample(arr, n) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, n);
      }
      // Select 12 players for the pool
      let pool;
      let goalPoints;
      let goalAssists;

      if (forceRefresh && cached) {
        // On refresh: shuffle the pool but keep goals stable
        pool = sample(sorted, 5);
        console.log(
          `🎲 Refreshed players: ${pool.map((p) => p.name).join(", ")}`
        );
        goalPoints = cached.goals.points;
        goalAssists = cached.goals.assists;
      } else {
        // First load: take top 5 and calculate goals
        pool = sorted.slice(0, 5);
        console.log(`⭐ Initial top 5: ${pool.map((p) => p.name).join(", ")}`);
        const totalPoints = pool.reduce((s, p) => s + p.pts, 0);
        const totalAssists = pool.reduce((s, p) => s + p.ast, 0);
        // Tough but attainable: 90% of combined averages
        goalPoints = Math.max(1, Math.round(totalPoints * 0.9));
        goalAssists = Math.max(1, Math.round(totalAssists * 0.9));
      }

      // Use all available players in the pool

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
    }

    // Default route
    else {
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
  console.log(`📍 Endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/players?team_id=12`);
  console.log(
    `   GET http://localhost:${PORT}/api/stats?season=2024&player_ids=1,2,3`
  );
});
