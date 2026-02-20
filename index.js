import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));

function cleanLink(url) {
  if (!url) return "";
  url = url.trim();
  url = url.replace(/(\?|&)utm_[^&]+/gi, "");
  url = url.replace(/(\?|&)fbclid=[^&]+/gi, "");
  url = url.replace(/(\?|&)igshid=[^&]+/gi, "");
  url = url.replace("m.facebook.com", "facebook.com");
  url = url.replace("mobile.twitter.com", "twitter.com");
  url = url.replace("x.com", "twitter.com");
  url = url.split("&")[0];
  return url;
}

// Simple placeholder for download links
app.get("/download/:platform", async (req, res) => {
  const { platform } = req.params;
  const url = cleanLink(req.query.url);

  // In production, replace this with real platform fetch
  res.send(`
    <h2>${platform.toUpperCase()} Download</h2>
    <p>Cleaned URL: ${url}</p>
    <a href="${url}" download>Download Now</a>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
