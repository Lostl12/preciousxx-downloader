import express from "express"; import fetch from "node-fetch";

const app = express(); app.use(express.static("public"));

app.get("/preview", async (req, res) => { const url = req.query.url; try { // ------------------------------ // 1️⃣ TikTok (DO NOT TOUCH) // ------------------------------ if (url.includes("tiktok.com")) { const r = await fetch(https://tikwm.com/api/?url=${encodeURIComponent(url)}); const d = await r.json(); return res.json({ thumbnail: d.data.cover, qualities: [ { label: "HD Video", url: d.data.play }, { label: "Watermark Video", url: d.data.wmplay }, { label: "Audio MP3", url: d.data.music } ] }); }

// ------------------------------
// 2️⃣ Universal extractor for IG / FB / Pinterest / YT
// ------------------------------
const r = await fetch(`https://api.vidfetch.io/fetch?url=${encodeURIComponent(url)}`);
const d = await r.json();

if (!d || !d.video) return res.json({ error: "Cannot fetch media" });

return res.json({
  thumbnail: d.thumbnail || "https://via.placeholder.com/320x180",
  qualities: d.qualities && d.qualities.length ? d.qualities : [
    { label: "Download Video", url: d.video }
  ]
});

} catch (e) { console.log(e); res.json({ error: "Server error" }); } });

// ------------------------------ // Download route (forces file save) // ------------------------------ app.get("/download", async (req, res) => { try { const r = await fetch(req.query.url); res.setHeader("Content-Disposition", "attachment; filename=video.mp4"); res.setHeader("Content-Type", "video/mp4"); r.body.pipe(res); } catch { res.status(500).send("Download failed"); } });

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log("Server running"));
