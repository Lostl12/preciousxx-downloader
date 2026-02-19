const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/download", async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.json({ success: false });
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
      const response = await axios.get(api);
      const video = response.data.data.play;

      return res.json({
        success: true,
        preview: video,
        qualities: [
          { quality: "HD", url: video }
        ]
      });
    }

    // Instagram
    if (url.includes("instagram.com")) {
      const api = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
      const response = await axios.get(api);
      const video = response.data.data[0].url;

      return res.json({
        success: true,
        preview: video,
        qualities: [
          { quality: "HD", url: video }
        ]
      });
    }

    res.json({ success: false });

  } catch (err) {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
