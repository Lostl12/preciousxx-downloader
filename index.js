import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

/* FETCH MEDIA (temporary demo) */
app.post("/fetch", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No link" });
  }

  res.json({
    thumbnail: "https://via.placeholder.com/300x170",
    downloads: [
      { quality: "720p", url: `/download?url=${encodeURIComponent(url)}` },
      { quality: "480p", url: `/download?url=${encodeURIComponent(url)}` },
      { quality: "360p", url: `/download?url=${encodeURIComponent(url)}` }
    ]
  });
});

/* FORCE DOWNLOAD */
app.get("/download", (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("No file");
  }

  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");

  https.get(fileUrl, (stream) => {
    stream.pipe(res);
  }).on("error", () => {
    res.status(500).send("Download failed");
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
