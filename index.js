// Example wrapper in index.js
async function safeFetch(scraper, url) {
  try {
    const result = await Promise.race([
      scraper(url),
      new Promise((_, reject) => setTimeout(() => reject("Timeout"), 10000))
    ]);
    return result || { error: "Failed to fetch media" };
  } catch (err) {
    return { error: "Failed to fetch media" };
  }
}
