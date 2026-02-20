import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

/* TEST FETCH — returns fake download options */
app.post("/fetch", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No link" });
  }

  res.json({
    thumbnail: "https://via.placeholder.com/300x170",
    downloads: [
      { quality: "720p", url: url },
      { quality: "480p", url: url },
      { quality: "360p", url: url }
    ]
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
