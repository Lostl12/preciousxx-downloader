import fetch from "node-fetch";

export default async function twitter(url) {
  try {
    const apiUrl = `https://api.twitter.com/2/tweet?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return { thumbnail: data.thumbnail, size: "Unknown", qualities: [{ name: "HD", url: data.video_url }] };
  } catch { return null; }
}
