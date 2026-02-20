import fetch from "node-fetch";

export default async function reddit(url) {
  try {
    const res = await fetch(`${url}.json`);
    const data = await res.json();
    const post = data[0].data.children[0].data;
    const videoUrl = post.secure_media?.reddit_video?.fallback_url || "";
    const thumbnail = post.thumbnail || "";
    return { thumbnail, size: "Unknown", qualities: [{ name: "HD", url: videoUrl }] };
  } catch {
    return null;
  }
}
