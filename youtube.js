const ytdl = require("ytdl-core");

module.exports = async function(url) {
  const info = await ytdl.getInfo(url);
  const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

  const qualities = formats
    .filter(f => f.hasVideo && f.hasAudio)
    .map(f => ({
      quality: f.qualityLabel || "HD",
      url: `/getfile?url=${encodeURIComponent(f.url)}`
    }));

  return {
    thumbnail: info.videoDetails.thumbnails[0].url,
    size: "HD",
    qualities
  };
};