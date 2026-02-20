import fetch from "node-fetch";

export default async function dailymotion(url) {
  try {
    const res = await fetch(`https://api.dailymotion.com/video/${url.split("/video/")[1]}?fields=thumbnail_url,url`);
    const data = await res.json();
    return { thumbnail: data.thumbnail_url, size: "Unknown", qualities: [{ name: "HD", url: data.url }] };
  } catch {
    return null;
  }
}
