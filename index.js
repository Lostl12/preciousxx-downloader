import express from "express";
import fs from "fs";
import path from "path";

// Import all extractors
import tiktok from "./extractors/tiktok.js";
import instagram from "./extractors/instagram.js";
import facebook from "./extractors/facebook.js";
import twitter from "./extractors/twitter.js";
import youtube from "./extractors/youtube.js";
import pinterest from "./extractors/pinterest.js";
import reddit from "./extractors/reddit.js";
import vimeo from "./extractors/vimeo.js";
import dailymotion from "./extractors/dailymotion.js";
import likee from "./extractors/likee.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(process.cwd(), "public")));

// Counter setup
const counterFile = path.join(process.cwd(), "utils/counter.json");
if (!fs.existsSync(counterFile)) {
  fs.writeFileSync(counterFile, JSON.stringify({ totalDownloads: 0 }, null, 2));
}

// Universal download route
app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    let result = null;

    if (!url) return res.json({ success: false, message: "No URL provided" });

    // Platform detection
    if (url.includes("tiktok.com")) result = await tiktok(url);
    else if (url.includes("instagram.com")) result = await instagram(url);
    else if (url.includes("facebook.com") || url.includes("fb.watch")) result = await facebook(url);
    else if (url.includes("twitter.com") || url.includes("x.com")) result = await twitter(url);
    else if (url.includes("youtube.com") || url.includes("youtu.be")) result = await youtube(url);
    else if (url.includes("pinterest.com")) result = await pinterest(url);
    else if (url.includes("reddit.com")) result = await reddit(url);
    else if (url.includes("vimeo.com")) result = await vimeo(url);
    else if (url.includes("dailymotion.com")) result = await dailymotion(url);
    else if (url.includes("likee.video")) result = await likee(url);

    if (!result) return res.json({ success: false, message: "Platform not supported yet" });

    // Increment counter
    const counter = JSON.parse(fs.readFileSync(counterFile, "utf-8"));
    counter.totalDownloads += 1;
    fs.writeFileSync(counterFile, JSON.stringify(counter, null, 2));

    res.json({
      success: true,
      thumbnail: result.thumbnail,
      size: result.size || "Unknown",
      qualities: result.qualities || [],
      totalDownloads: counter.totalDownloads
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// Get total downloads
app.get("/counter", (req, res) => {
  try {
    const counter = JSON.parse(fs.readFileSync(counterFile, "utf-8"));
    res.json({ totalDownloads: counter.totalDownloads });
  } catch {
    res.json({ totalDownloads: 0 });
  }
});

// Force file download
app.get("/getfile", async (req, res) => {
  try {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.send("No file URL provided");

    const axios = (await import("axios")).default;
    const response = await axios({ url: fileUrl, method: "GET", responseType: "stream" });

    res.setHeader("Content-Disposition", "attachment; filename=preciousxx.mp4");
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);

  } catch (err) {
    res.send("Download failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
