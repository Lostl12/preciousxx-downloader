const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/download", async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.send("Enter a valid link");
    }

    let api = "";

    // Detect platform automatically
    if (url.includes("tiktok.com")) {
      api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    } 
    else if (url.includes("instagram.com")) {
      api = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
    } 
    else {
      return res.send("Platform not supported yet");
    }

    const response = await axios.get(api);

    let videoUrl =
      response.data?.data?.play ||
      response.data?.data?.url ||
      response.data?.data?.video;

    if (!videoUrl) {
      return res.send("Failed to fetch media");
    }

    res.send(`
      <h2>Download Ready ✅</h2>
      <video src="${videoUrl}" controls width="320"></video>
      <br><br>
      <a href="${videoUrl}" download>
        <button style="padding:10px 20px;font-size:16px;">
          Download Now
        </button>
      </a>
      <br><br>
      <a href="/">Back</a>
    `);

  } catch (err) {
    res.send("Error processing link");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
