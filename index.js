import express from "express";
import fs from "fs-extra";
import path from "path";
import pLimit from "p-limit";

import tiktok from "./extractors/tiktok.js";
import youtube from "./extractors/youtube.js";
import instagram from "./extractors/instagram.js";
import facebook from "./extractors/facebook.js";
import reddit from "./extractors/reddit.js";
import pinterest from "./extractors/pinterest.js";
import vimeo from "./extractors/vimeo.js";
import dailymotion from "./extractors/dailymotion.js";
import likee from "./extractors/likee.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const counterFile = path.join("./utils/counter.json");
const limit = pLimit(2); // max 2 concurrent extractor fetches

async function incrementCounter() {
  try {
    let data = { count: 0 };
    if (await fs.pathExists(counterFile)) data = await fs.readJson(counterFile);
    data.count += 1;
    await fs.writeJson(counterFile, data, { spaces: 2 });
    return data.count;
  } catch {
    return -1;
  }
}

// universal link cleaner
function cleanLink(url) {
  if (!url) return "";
  url = url.trim();
  url = url.replace(/(\?|&)utm_[^&]+/g, "");
  url = url.replace(/(\?|&)fbclid=[^&]+/g, "");
  url = url.replace(/(\?|&)igshid=[^&]+/g, "");
  url = url.split("&")[0];
  return url;
}

async function safeFetch(scraper, url) {
  try {
    const result = await Promise.race([
      scraper(url),
      new Promise((_, reject) => setTimeout(() => reject("Timeout"), 10000))
    ]);
    return result || { error: "Failed to fetch media" };
  } catch {
    return { error: "Failed to fetch media" };
  }
}

app.post("/download", async (req, res) => {
  const { url, platform } = req.body;
  if (!url || !platform) return res.json({ error: "Missing url or platform" });

  const cleanedUrl = cleanLink(url);
  let scraper;

  switch (platform.toLowerCase()) {
    case "tiktok": scraper = tiktok; break;
    case "youtube": scraper = youtube; break;
    case "instagram": scraper = instagram; break;
    case "facebook": scraper = facebook; break;
    case "reddit": scraper = reddit; break;
    case "pinterest": scraper = pinterest; break;
    case "vimeo": scraper = vimeo; break;
    case "dailymotion": scraper = dailymotion; break;
    case "likee": scraper = likee; break;
    default: return res.json({ error: "Unsupported platform" });
  }

  const result = await limit(() => safeFetch(scraper, cleanedUrl));

  if (!result.error) await incrementCounter();
  res.json(result);
});

app.get("/counter", async (req, res) => {
  try {
    const data = await fs.readJson(counterFile);
    res.json(data);
  } catch {
    res.json({ count: 0 });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Downloader running on port ${PORT}`));
