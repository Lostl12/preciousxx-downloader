import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));

// UNIVERSAL PREVIEW
app.get("/preview", async (req, res) => {
  const url = req.query.url;

  try {
    let media = {
      thumbnail: "https://via.placeholder.com/320x180",
      qualities: [{ label: "Download Video", url }]
    };

    // TIKTOK
    if (url.includes("tiktok.com")) {
      const r = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      media = {
        thumbnail: d.data.cover,
        qualities: [
          { label: "HD Video", url: d.data.play },
          { label: "Watermark Video", url: d.data.wmplay },
          { label: "Audio MP3", url: d.data.music }
        ]
      };
    }

    // INSTAGRAM
    else if (url.includes("instagram.com")) {
      const r = await fetch(`https://api.vxtiktok.com/instagram?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      media = {
        thumbnail: d.thumbnail,
        qualities: [
          { label: "Video MP4", url: d.video },
          { label: "Audio MP3", url: d.audio }
        ]
      };
    }

    // FACEBOOK
    else if (url.includes("facebook.com")) {
      const r = await fetch(`https://api.vxtiktok.com/facebook?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      media = {
        thumbnail: d.thumbnail,
        qualities: [
          { label: "HD Video", url: d.video },
          { label: "Audio MP3", url: d.audio }
        ]
      };
    }

    // PINTEREST
    else if (url.includes("pinterest.com")) {
      const r = await fetch(`https://api.vxtiktok.com/pinterest?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      media = {
        thumbnail: d.thumbnail,
        qualities: [
          { label: "HD Video", url: d.video }
        ]
      };
    }

    // YOUTUBE
    else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const r = await fetch(`https://api.vxtiktok.com/youtube?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      media = {
        thumbnail: d.thumbnail,
        qualities: [
          { label: "360p", url: d.video360 },
          { label: "720p", url: d.video720 },
          { label: "Audio MP3", url: d.audio }
        ]
      };
    }

    return res.json(media);

  } catch (e) {
    console.log(e);
    res.json({ error: "Cannot fetch media" });
  }
});

// DOWNLOAD (forces file save)
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const response = await fetch(videoUrl);
    res.setHeader("Content-Disposition","attachment; filename=video.mp4");
    res.setHeader("Content-Type","video/mp4");
    response.body.pipe(res);
  } catch (e) {
    res.status(500).send("Download failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running"));
