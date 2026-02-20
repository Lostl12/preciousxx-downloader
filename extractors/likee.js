import fetch from "node-fetch";

export default async function likee(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const videoMatch = html.match(/"main_url":"(.*?)"/);
    const videoUrl = videoMatch ? videoMatch[1].replace(/\\/g, "") : "";
    const thumbnailMatch = html.match(/"cover_url":"(.*?)"/);
    const thumbnail = thumbnailMatch ? thumbnailMatch[1].replace(/\\/g, "") : "";
    return { thumbnail, size: "Unknown", qualities: [{ name: "HD", url: videoUrl }] };
  } catch { return null; }
}
