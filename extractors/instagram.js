import fetch from "node-fetch";

export default async function instagram(url) {
  try {
    let apiUrl = url;
    if (!url.includes("?__a=1")) apiUrl += "?__a=1&__d=dis";

    const res = await fetch(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await res.json();

    const media = data.graphql.shortcode_media;
    const videoUrl = media.video_url || media.edge_sidecar_to_children?.edges[0].node.video_url || "";
    const thumbnail = media.display_url || "";

    return { thumbnail, size: "Unknown", qualities: [{ name: "HD", url: videoUrl }] };
  } catch {
    return null;
  }
}
