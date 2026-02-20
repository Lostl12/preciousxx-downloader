const axios = require("axios");

module.exports = async function(url) {
  const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
  const response = await axios.get(api);

  const video = response.data.data.play;       // video link
  const thumbnail = response.data.data.cover;  // thumbnail image

  return {
    thumbnail,
    size: "HD",
    qualities: [
      { quality: "HD", url: `/getfile?url=${encodeURIComponent(video)}` }
    ]
  };
};