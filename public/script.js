const btn = document.getElementById("downloadBtn");
const urlInput = document.getElementById("url");
const platformSelect = document.getElementById("platform");
const resultDiv = document.getElementById("result");
const counterDiv = document.getElementById("counter");

btn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  const platform = platformSelect.value;

  if (!url) return alert("Paste a video link first!");

  resultDiv.innerHTML = "Fetching…";

  try {
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, platform })
    });
    const data = await res.json();

    if (data.error) resultDiv.innerHTML = `Error: ${data.error}`;
    else {
      let html = `<img src="${data.thumbnail}" width="200"><br>`;
      data.qualities.forEach(q => {
        html += `<a href="${q.url}" target="_blank">Download ${q.name}</a><br>`;
      });
      resultDiv.innerHTML = html;
    }

    // update counter
    const countRes = await fetch("/counter");
    const countData = await countRes.json();
    counterDiv.innerHTML = `Downloads: ${countData.count}`;
  } catch (e) {
    resultDiv.innerHTML = `Error: ${e.message}`;
  }
});
