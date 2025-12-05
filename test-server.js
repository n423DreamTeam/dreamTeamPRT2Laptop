import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8000;

const server = http.createServer((req, res) => {
  const filePath = path.join(
    process.cwd(),
    req.url === "/" ? "test.html" : req.url
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const contentType = ext === ".html" ? "text/html" : "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
