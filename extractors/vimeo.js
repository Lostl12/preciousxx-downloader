import fetch from "node-fetch";

export default async function vimeo(url) {
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return { thumbnail: data.thumbnail_url, size: "Unknown", qualities: [{ name: "HD", url }] };
  } catch {
    return null;
  }
}
