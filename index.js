const express = require("express");
const app = express();

// To handle form submissions
app.use(express.urlencoded({ extended: true }));

// Serve all files from current folder (including index.html)
app.use(express.static("."));

// Receive the URL from the form
app.post("/download", async (req, res) => {
  const url = req.body.url;
  res.send("Processing: " + url);
});

// Use port provided by hosting or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
