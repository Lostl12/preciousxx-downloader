import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* FETCH MEDIA INFO */
app.post("/fetch", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "No link" });

  try {
    // fake demo preview so UI always shows something clean
    res.json({
      thumbnail: "https://i.imgur.com/7b1XK0E.jpeg",
      downloads: [
        { quality: "480p", url: `/download?url=${encodeURIComponent(url)}` },
        { quality: "720p", url: `/download?url=${encodeURIComponent(url)}` }
      ]
    });

  } catch {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

/* FORCE REAL FILE DOWNLOAD */
app.get("/download", async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).send("No file");

  try {
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
      maxRedirects: 5,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);

  } catch {
    res.status(500).send("Download failed");
  }
});

app.listen(PORT, () => {
  console.log("Server running");
});
