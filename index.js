import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

app.get("/preview", async (req, res) => {
  const url = req.query.url;

  try {

    // ✅ TikTok (keep your good options)
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

    // ✅ Other platforms (IG, FB, Pinterest, YouTube)
    if (
      url.includes("instagram.com") ||
      url.includes("facebook.com") ||
      url.includes("pinterest.com") ||
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
      const r = await fetch(`https://savevideobot.com/api/ajaxSearch`, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: `q=${encodeURIComponent(url)}&vt=home`
      });

      const html = await r.text();

      const thumbMatch = html.match(/<img src="(https:[^"]+)"/);
      const videoMatch = html.match(/href="(https:[^"]+\.mp4[^"]*)"/);

      if (!videoMatch) {
        return res.json({ error: "Cannot fetch media" });
      }

      return res.json({
        thumbnail: thumbMatch ? thumbMatch[1] : "https://via.placeholder.com/320x180",
        qualities: [
          { label: "Download Video", url: videoMatch[1] }
        ]
      });
    }

    return res.json({ error: "Cannot fetch media" });

  } catch (e) {
    console.log(e);
    res.json({ error: "Server error" });
  }
});

// force real download to phone
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
