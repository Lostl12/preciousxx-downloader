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
      return res.send("Please enter a link");
    }

    // Free TikTok API
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;

    const response = await axios.get(api);

    const video = response.data.data.play;

    if (!video) {
      return res.send("Unable to fetch video");
    }

    res.send(`
      <h2>Download Ready ✅</h2>
      <video src="${video}" controls width="300"></video>
      <br><br>
      <a href="${video}" download>
        <button>Download Video</button>
      </a>
      <br><br>
      <a href="/">Go Back</a>
    `);

  } catch (error) {
    res.send("Error processing link");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
