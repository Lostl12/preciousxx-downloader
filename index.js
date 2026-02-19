const express = require("express");
const axios = require("axios");
const path = require("path");

// Import all extractors
const tiktok = require("./extractors/tiktok");
const instagram = require("./extractors/instagram");
const facebook = require("./extractors/facebook");
const twitter = require("./extractors/twitter");
const youtube = require("./extractors/youtube");
const pinterest = require("./extractors/pinterest");
const reddit = require("./extractors/reddit");
const likee = require("./extractors/likee");
const vimeo = require("./extractors/vimeo");
const dailymotion = require("./extractors/dailymotion");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle download request
app.post("/download", async (req, res) => {
  try {
    const url = req.body.url;
    let data = null;

    // Detect platform
    if (url.includes("tiktok.com")) data = await tiktok(url);
    else if (url.includes("instagram.com")) data = await instagram(url);
    else if (url.includes("facebook.com")) data = await facebook(url);
    else if (url.includes("twitter.com") || url.includes("x.com")) data = await twitter(url);
    else if (url.includes("youtube.com") || url.includes("youtu.be")) data = await youtube(url);
    else if (url.includes("pinterest.com")) data = await pinterest(url);
    else if (url.includes("reddit.com")) data = await reddit(url);
    else if (url.includes("likee.video")) data = await likee(url);
    else if (url.includes("vimeo.com")) data = await vimeo(url);
    else if (url.includes("dailymotion.com")) data = await dailymotion(url);

    if (!data) return res.json({ success: false });

    res.json({
      success: true,
      thumbnail: data.thumbnail,
      size: data.size,
      qualities: data.qualities
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// Force file download route
app.get("/getfile", async (req, res) => {
  try {
    const fileUrl = req.query.url;

    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream"
    });

    res.setHeader("Content-Disposition", "attachment; filename=preciousxx.mp4");
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);

  } catch (err) {
    res.send("Download failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
