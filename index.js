import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/fetch", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "No link" });

  res.json({
    thumbnail: "https://via.placeholder.com/320x180?text=Video+Preview",
    downloads: [
      {
        quality: "Download Video",
        url: `/download?url=${encodeURIComponent(url)}`
      }
    ]
  });
});

/* FOLLOW REDIRECT + FORCE DOWNLOAD */
function streamFile(fileUrl, res) {
  const client = fileUrl.startsWith("https") ? https : http;

  client.get(fileUrl, (response) => {

    // follow redirect
    if (
      response.statusCode === 301 ||
      response.statusCode === 302
    ) {
      return streamFile(response.headers.location, res);
    }

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");

    response.pipe(res);

  }).on("error", () => {
    res.status(500).send("Download failed");
  });
}

app.get("/download", (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).send("No file");

  streamFile(fileUrl, res);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
