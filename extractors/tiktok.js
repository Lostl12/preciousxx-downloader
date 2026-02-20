import fetch from "node-fetch";

export default async function tiktok(url) {
  try {
    const apiUrl = `https://api.tiktokv.com/aweme/v1/video/?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    return {
      thumbnail: data.thumbnail || "",
      size: "Unknown",
      qualities: [{ name: "HD", url: data.video_url }]
    };
  } catch {
    return null;
  }
}
