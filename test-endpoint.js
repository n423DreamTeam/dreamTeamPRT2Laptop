import http from "http";

const options = {
  hostname: "localhost",
  port: 3001,
  path: "/api/daily",
  method: "GET",
  timeout: 5000,
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("✅ Response received!");
    console.log("Status:", res.statusCode);
    console.log("Data:", data);
    try {
      const json = JSON.parse(data);
      console.log("Parsed JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.error("Failed to parse JSON");
    }
    process.exit(0);
  });
});

req.on("error", (e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});

req.on("timeout", () => {
  console.error("❌ Timeout");
  req.destroy();
  process.exit(1);
});

console.log("Connecting to http://localhost:3001/api/daily...");
req.end();
