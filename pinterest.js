const axios = require("axios");

module.exports = async function(url) {
  const api = `https://api.akuari.my.id/pinterest?url=${encodeURIComponent(url)}`;
  const response = await axios.get(api);

  if (!response.data || !response.data.result) return null;

  const video = response.data.result.url;

  return {
    thumbnail: response.data.result.thumbnail || "",
    size: "HD",
    qualities: [
      { quality: "HD", url: `/getfile?url=${encodeURIComponent(video)}` }
    ]
  };
};