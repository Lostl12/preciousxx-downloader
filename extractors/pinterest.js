import fetch from "node-fetch";

export default async function pinterest(url) {
  try {
    const res = await fetch(`https://api.pinterest.com/v1/pins/${encodeURIComponent(url)}/`);
    const data = await res.json();
    return { thumbnail: data.data.image.original.url, size: "Unknown", qualities: [{ name: "HD", url: data.data.image.original.url }] };
  } catch { return null; }
}
