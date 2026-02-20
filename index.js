import express from "express";

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

app.post("/clean", (req, res) => {
  const { url } = req.body;
  const cleaned = cleanLink(url);
  res.json({ cleaned });
});

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on " + PORT));
