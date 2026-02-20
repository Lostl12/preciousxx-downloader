import ytdl from "ytdl-core";

export default async function youtube(url) {
  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, "videoandaudio");
    const hdFormat = formats.find(f => f.qualityLabel === "720p") || formats[0];
    return { thumbnail: info.videoDetails.thumbnails.pop().url, size: "Unknown", qualities: [{ name: hdFormat.qualityLabel, url: hdFormat.url }] };
  } catch {
    return null;
  }
}
