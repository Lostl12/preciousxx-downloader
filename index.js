import express from "express";
import fetch from "node-fetch"; // make sure in package.json
import path from "path";

const app = express();
app.use(express.static("public"));

// UNIVERSAL PREVIEW ROUTE
app.get("/preview", async (req, res) => {
  const url = req.query.url;
  try {
    let media = { thumbnail:"https://via.placeholder.com/320x180", video: url };

    // Platform detection
    if(url.includes("tiktok.com")) {
      const r = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await r.json();
      media = { thumbnail: data.data.cover, video: data.data.play };
    } 
    else if(url.includes("instagram.com")) {
      // placeholder API — replace with working IG scraper
      media = { thumbnail:"https://via.placeholder.com/320x180?text=Instagram", video:url };
    } 
    else if(url.includes("facebook.com")) {
      media = { thumbnail:"https://via.placeholder.com/320x180?text=Facebook", video:url };
    } 
    else if(url.includes("pinterest.com")) {
      media = { thumbnail:"https://via.placeholder.com/320x180?text=Pinterest", video:url };
    } 
    else if(url.includes("youtube.com") || url.includes("youtu.be")) {
      media = { thumbnail:"https://via.placeholder.com/320x180?text=YouTube", video:url };
    }

    res.json({
      thumbnail: media.thumbnail,
      qualities: [{ label:"Download Video", url: media.video }]
    });

  } catch(e) {
    res.json({ error:"Cannot fetch media" });
  }
});

// FORCE DOWNLOAD
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  try {
    const response = await fetch(videoUrl);
    res.setHeader("Content-Disposition","attachment; filename=video.mp4");
    res.setHeader("Content-Type","video/mp4");
    response.body.pipe(res);
  } catch(e) {
    res.status(500).send("Download failed");
  }
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Server running on port "+PORT));
