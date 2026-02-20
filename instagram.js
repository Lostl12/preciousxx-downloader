const axios = require("axios");

module.exports = async function(url) {
  // Use an Instagram scraping API (free public)
  const api = `https://api.akuari.my.id/instagram?url=${encodeURIComponent(url)}`;
  const response = await axios.get(api);

  if (!response.data || !response.data.result) return null;

  const media = response.data.result;

  // Prepare qualities array
  const qualities = media.map((item, index) => {
    return {
      quality: "HD",
      url: `/getfile?url=${encodeURIComponent(item.url)}`
    };
  });

  return {
    thumbnail: media[0].thumbnail || "",
    size: `${media.length} file(s)`,
    qualities
  };
};