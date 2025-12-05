import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5173; // Vite's default port

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(
    __dirname,
    req.url === "/" ? "src/dashboard.html" : req.url
  );

  // Try to serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found: " + filePath);
      return;
    }

    const ext = path.extname(filePath);
    let contentType = "text/plain";

    if (ext === ".html") contentType = "text/html";
    else if (ext === ".css") contentType = "text/css";
    else if (ext === ".js") contentType = "application/javascript";
    else if (ext === ".json") contentType = "application/json";
    else if (ext === ".avif") contentType = "image/avif";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg") contentType = "image/jpeg";
    else if (ext === ".svg") contentType = "image/svg+xml";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Dev server running at http://localhost:${PORT}`);
  console.log(`📊 API server at http://localhost:3001`);
});
