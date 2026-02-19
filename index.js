const express = require("express");
const axios = require("axios");
const path = require("path");

const tiktok = require("./extractors/tiktok"); // call the TikTok extractor

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle download request
app.post("/download", async (req, res) => {
  try {
    const url = req.body.url;

    // Only TikTok for now
    if (!url.includes("tiktok.com")) {
      return res.json({ success: false });
    }

    const data = await tiktok(url);

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
