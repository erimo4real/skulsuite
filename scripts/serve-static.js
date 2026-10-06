/**
 * Minimal static file server for the exported site in ./out.
 * Zero dependencies. Used only for local preview of the production build.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "out");
const PORT = process.env.PORT || 4321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let filePath = path.join(ROOT, urlPath);

    // Directory → index.html; if the dir has no index.html, fall back to the
    // sibling .html file (e.g. /products → out/products.html when out/products/
    // is also a route directory).
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const index = path.join(filePath, "index.html");
      filePath = fs.existsSync(index) ? index : filePath + ".html";
    } else if (!path.extname(filePath)) {
      const asDir = path.join(filePath, "index.html");
      if (fs.existsSync(asDir)) filePath = asDir;
    }

    // extensionless miss → try .html (e.g. /sitemap.xml is a real file, so fine)
    if (!fs.existsSync(filePath)) {
      const withHtml = filePath + ".html";
      if (fs.existsSync(withHtml)) filePath = withHtml;
    }

    if (!fs.existsSync(filePath)) {
      const notFound = path.join(ROOT, "404.html");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(PORT, () => {
  console.log(`ScholarSuite preview: http://localhost:${PORT}`);
});
