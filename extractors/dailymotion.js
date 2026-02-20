const axios = require("axios");

module.exports = async function(url) {
  const api = `https://api.akuari.my.id/dailymotion?url=${encodeURIComponent(url)}`;
  const response = await axios.get(api);

  if (!response.data || !response.data.result) return null;

  const media = response.data.result;

  const qualities = media.map((item) => ({
    quality: item.quality || "HD",
    url: `/getfile?url=${encodeURIComponent(item.url)}`
  }));

  return {
    thumbnail: media[0].thumbnail || "",
    size: `${media.length} file(s)`,
    qualities
  };
};