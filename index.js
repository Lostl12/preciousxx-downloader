import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* Health check */
app.get("/ping", (req, res) => {
  res.send("OK");
});

/* SIMPLE LINK CLEANER (what you wanted) */
app.post("/clean", (req, res) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "No link provided" });

    // remove tracking params
    const cleanUrl = url.split("?")[0];

    res.json({
      success: true,
      cleaned: cleanUrl
    });
  } catch (err) {
    res.status(500).json({ error: "Cleaner failed" });
  }
});

/* TEST DOWNLOAD MENU DATA (no playback) */
app.post("/get-video", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "No link provided" });

    // Fake response structure for UI download menu
    res.json({
      success: true,
      title: "Video Ready",
      thumbnail: "https://via.placeholder.com/320x180.png?text=Thumbnail",
      downloads: [
        { quality: "1080p", url: url },
        { quality: "720p", url: url },
        { quality: "480p", url: url }
      ]
    });

  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
