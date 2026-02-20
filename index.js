import express from "express";
import fs from "fs-extra";
import path from "path";
import pLimit from "p-limit";

// Import extractors
import tiktok from "./extractors/tiktok.js";
import instagram from "./extractors/instagram.js";
import youtube from "./extractors/youtube.js";
import twitter from "./extractors/twitter.js";
import reddit from "./extractors/reddit.js";
import pinterest from "./extractors/pinterest.js";
import vimeo from "./extractors/vimeo.js";
import dailymotion from "./extractors/dailymotion.js";
import likee from "./extractors/likee.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static("public"));

// Counter file
const counterFile = path.join("./utils/counter.json");

// Helper: increment counter
async function incrementCounter() {
  try {
    let data = { count: 0 };
    if (await fs.pathExists(counterFile)) {
      data = await fs.readJson(counterFile);
    }
    data.count += 1;
    await fs.writeJson(counterFile, data, { spaces: 2 });
    return data.count;
  } catch {
    return -1;
  }
}

// Safe extractor fetch with timeout
async function safeFetch(scraper, url) {
  try {
    const result = await Promise.race([
      scraper(url),
      new Promise((_, reject) => setTimeout(() => reject("Timeout"), 10000))
    ]);
    return result || { error: "Failed to fetch media" };
  } catch (err) {
    return { error: "Failed to fetch media" };
  }
}

// Limit concurrent heavy fetches
const limit = pLimit(2);

app.post("/download", async (req, res) => {
  const { url, platform } = req.body;
  if (!url || !platform) return res.json({ error: "Missing url or platform" });

  // Select extractor
  let scraper;
  switch (platform.toLowerCase()) {
    case "tiktok": scraper = tiktok; break;
    case "instagram": scraper = instagram; break;
    case "youtube": scraper = youtube; break;
    case "twitter": scraper = twitter; break;
    case "reddit": scraper = reddit; break;
    case "pinterest": scraper = pinterest; break;
    case "vimeo": scraper = vimeo; break;
    case "dailymotion": scraper = dailymotion; break;
    case "likee": scraper = likee; break;
    default: return res.json({ error: "Unsupported platform" });
  }

  // Run safely with concurrency limit
  const result = await limit(() => safeFetch(scraper, url));

  // Increment counter if successful
  if (!result.error) await incrementCounter();

  res.json(result);
});

// Simple counter endpoint
app.get("/counter", async (req, res) => {
  try {
    const data = await fs.readJson(counterFile);
    res.json(data);
  } catch {
    res.json({ count: 0 });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Downloader running on port ${PORT}`);
});
