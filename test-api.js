import http from "http";

const options = {
  hostname: "localhost",
  port: 3001,
  path: "/api/daily",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Response status:", res.statusCode);
    console.log("Response data:", data);
  });
});

req.on("error", (e) => {
  console.error("Error:", e.message);
});

req.end();
