import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const sendFile = (res, filePath) => {
  const extension = extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": filePath.includes(`${join("", "assets")}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache",
  });

  createReadStream(filePath).pipe(res);
};

const notFound = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
};

const safePath = (pathname) => {
  const cleanedPath = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(decodeURIComponent(cleanedPath)).replace(/^([.][.][/\\])+/, "");
  const resolvedPath = join(distDir, normalized);

  return resolvedPath.startsWith(distDir) ? resolvedPath : null;
};

const serveIndex = async (res) => {
  try {
    const html = await readFile(join(distDir, "index.html"));
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.end(html);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Build output not found. Run npm run build first.");
  }
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("OK");
    return;
  }

  const requestedPath = safePath(url.pathname);

  if (!requestedPath) {
    notFound(res);
    return;
  }

  if (existsSync(requestedPath) && statSync(requestedPath).isFile()) {
    sendFile(res, requestedPath);
    return;
  }

  if (extname(url.pathname)) {
    notFound(res);
    return;
  }

  await serveIndex(res);
}).listen(port, "0.0.0.0", () => {
  console.log(`Production server running on port ${port}`);
});