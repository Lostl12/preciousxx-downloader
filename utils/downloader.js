const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Download a file from a URL and save to local folder
 * @param {string} fileUrl - direct media URL
 * @param {string} filename - name of the file to save
 * @returns {Promise<string>} - returns saved file path
 */
async function downloadFile(fileUrl, filename) {
  const filepath = path.join(__dirname, "../downloads", filename);

  // Make sure downloads folder exists
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream"
  });

  const writer = fs.createWriteStream(filepath);

  // Optional: track progress
  const totalLength = response.headers["content-length"];
  let downloaded = 0;

  response.data.on("data", (chunk) => {
    downloaded += chunk.length;
    if (totalLength) {
      const percent = ((downloaded / totalLength) * 100).toFixed(2);
      process.stdout.write(`Downloading ${filename}: ${percent}%\r`);
    }
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log(`\nDownloaded ${filename}`);
      resolve(filepath);
    });
    writer.on("error", reject);
  });
}

module.exports = { downloadFile };
