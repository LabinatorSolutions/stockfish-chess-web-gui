import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { serve } from "bun";

const PORT = 3000;
const DIST_DIR = join(import.meta.dir, "dist");

const CSP = [
	"default-src 'self'",
	"script-src 'self' 'wasm-unsafe-eval'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self' data:",
	"connect-src 'self'",
	"worker-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"frame-ancestors 'none'",
].join("; ");

console.log(`Starting server on http://localhost:${PORT}`);
console.log(`Serving files from: ${DIST_DIR}`);

serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		let path = join(DIST_DIR, url.pathname);

		if (url.pathname === "/") {
			path = join(DIST_DIR, "index.html");
		}

		if (!existsSync(path)) {
			// SPA fallback or 404
			if (req.headers.get("accept")?.includes("text/html")) {
				path = join(DIST_DIR, "index.html");
			} else {
				return new Response("Not Found", { status: 404 });
			}
		}

		const file = readFileSync(path);
		const extension = path.split(".").pop();

		// MIME types mapping
		const mimeTypes = {
			html: "text/html",
			js: "application/javascript",
			css: "text/css",
			svg: "image/svg+xml",
			png: "image/png",
			wasm: "application/wasm",
			mp3: "audio/mpeg",
			bin: "application/octet-stream",
			json: "application/json",
		};

		const contentType = mimeTypes[extension] || "application/octet-stream";

		return new Response(file, {
			headers: {
				"Content-Type": contentType,
				"Cross-Origin-Opener-Policy": "same-origin",
				"Cross-Origin-Embedder-Policy": "require-corp",
				"Content-Security-Policy": CSP,
			},
		});
	},
});
