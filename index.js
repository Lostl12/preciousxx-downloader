import express from "express";
import ytdl from "ytdl-core";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/info", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "No URL" });

    const info = await ytdl.getInfo(url);

    const formats = ytdl
      .filterFormats(info.formats, "videoandaudio")
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        quality: f.qualityLabel,
        url: f.url
      }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      downloads: formats
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
