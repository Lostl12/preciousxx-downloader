import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

app.get("/preview", async (req, res) => {
  const url = req.query.url;

  try {
    // ✅ TikTok (leave perfect)
    if (url.includes("tiktok.com")) {
      const r = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const d = await r.json();

      return res.json({
        thumbnail: d.data.cover,
        qualities: [
          { label: "HD Video", url: d.data.play },
          { label: "Watermark Video", url: d.data.wmplay },
          { label: "Audio MP3", url: d.data.music }
        ]
      });
    }

    // ✅ Instagram / Facebook / Pinterest / YouTube
    const r = await fetch("https://v3.fdownloader.net/api/ajaxSearch", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: `q=${encodeURIComponent(url)}&vt=home`
    });

    const data = await r.json();

    if (!data || !data.data) {
      return res.json({ error: "Cannot fetch media" });
    }

    const html = data.data;

    const thumbMatch = html.match(/<img src=\"(https:[^\"]+)\"/);
    const videoMatches = [...html.matchAll(/href=\"(https:[^\"]+\.mp4[^\"]*)\"/g)];

    if (!videoMatches.length) {
      return res.json({ error: "Cannot fetch media" });
    }

    const qualities = videoMatches.map((m, i) => ({
      label: `Download ${i + 1}`,
      url: m[1]
    }));

    return res.json({
      thumbnail: thumbMatch ? thumbMatch[1] : "https://via.placeholder.com/320x180",
      qualities
    });

  } catch (e) {
    console.log(e);
    res.json({ error: "Server error" });
  }
});

// ✅ force download to phone
app.get("/download", async (req, res) => {
  try {
    const r = await fetch(req.query.url);
    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");
    r.body.pipe(res);
  } catch {
    res.status(500).send("Download failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
