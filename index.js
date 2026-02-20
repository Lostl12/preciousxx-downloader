import express from "express";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/:platform", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "No URL provided" });

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true
    });

    const formats = info.formats
      .filter(f => f.height && f.url)
      .map(f => ({ quality: f.height + "p", url: f.url }))
      .slice(0, 6);

    res.json({ thumbnail: info.thumbnail, qualities: formats });
  } catch {
    res.json({ error: "Failed to fetch video" });
  }
});

// Force download route for mobile
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("No URL");
  res.redirect(url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
