const fs = require("fs");
const path = require("path");

// counter file
const counterFile = path.join(__dirname, "utils/counter.json");

// Make sure the file exists
if (!fs.existsSync(counterFile)) {
  fs.writeFileSync(counterFile, JSON.stringify({ downloads: 0 }, null, 2));
}

app.post("/download", async (req, res) => {
  try {
    const url = req.body.url;
    let data = null;

    // Detect platform
    if (url.includes("tiktok.com")) data = await tiktok(url);
    else if (url.includes("instagram.com")) data = await instagram(url);
    else if (url.includes("facebook.com")) data = await facebook(url);
    else if (url.includes("twitter.com") || url.includes("x.com")) data = await twitter(url);
    else if (url.includes("youtube.com") || url.includes("youtu.be")) data = await youtube(url);
    else if (url.includes("pinterest.com")) data = await pinterest(url);
    else if (url.includes("reddit.com")) data = await reddit(url);
    else if (url.includes("likee.video")) data = await likee(url);
    else if (url.includes("vimeo.com")) data = await vimeo(url);
    else if (url.includes("dailymotion.com")) data = await dailymotion(url);

    if (!data) return res.json({ success: false });

    // ✅ Increment download count safely
    let counter = JSON.parse(fs.readFileSync(counterFile, "utf-8"));
    counter.downloads += 1;
    fs.writeFileSync(counterFile, JSON.stringify(counter, null, 2));

    res.json({
      success: true,
      thumbnail: data.thumbnail,
      size: data.size,
      qualities: data.qualities,
      totalDownloads: counter.downloads
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});
