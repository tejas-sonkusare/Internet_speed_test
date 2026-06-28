const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ping
app.get("/api/speedtest/ping", (_req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  res.json({ ok: true, ts: Date.now() });
});

// Download
app.get("/api/speedtest/download", (req, res) => {
  const sizeBytes = Math.min(
    parseInt(req.query.size ?? "") || 25 * 1024 * 1024,
    100 * 1024 * 1024
  );

  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Length": String(sizeBytes),
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Access-Control-Expose-Headers": "Content-Length",
  });

  const CHUNK = 65536;
  const buf = Buffer.alloc(CHUNK);
  for (let i = 0; i < CHUNK; i++) buf[i] = i & 0xff;

  let sent = 0;
  const writeNext = () => {
    if (res.destroyed) return;
    if (sent >= sizeBytes) { res.end(); return; }
    const toSend = Math.min(CHUNK, sizeBytes - sent);
    const ok = res.write(buf.subarray(0, toSend));
    sent += toSend;
    if (ok) { setImmediate(writeNext); }
    else { res.once("drain", writeNext); }
  };
  res.once("close", () => res.destroy());
  writeNext();
});

// Upload
app.post(
  "/api/speedtest/upload",
  express.raw({ type: "*/*", limit: "100mb" }),
  (req, res) => {
    res.set("Cache-Control", "no-store");
    const bytes = Buffer.isBuffer(req.body) ? req.body.length : 0;
    res.json({ ok: true, bytes });
  }
);

module.exports = app;
