import { statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { file, serve } from "bun";
// COOP/COEP + CSP, read from public/_headers (the same file Netlify serves)
import { SECURITY_HEADERS } from "./headers.js";

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = resolve(import.meta.dir, "dist");

const MIME_TYPES = {
	html: "text/html; charset=utf-8",
	js: "text/javascript; charset=utf-8",
	css: "text/css; charset=utf-8",
	json: "application/json",
	svg: "image/svg+xml",
	png: "image/png",
	ico: "image/x-icon",
	wasm: "application/wasm",
	mp3: "audio/mpeg",
	woff2: "font/woff2",
	bin: "application/octet-stream",
};

/** Resolves a URL path to a regular file inside DIST_DIR, or null. */
const resolveFile = (pathname) => {
	let decoded;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		return null;
	}
	const path = resolve(DIST_DIR, `.${decoded}`);
	if (path !== DIST_DIR && !path.startsWith(DIST_DIR + sep)) return null;
	try {
		return statSync(path).isFile() ? path : null;
	} catch {
		return null;
	}
};

console.log(`Starting server on http://localhost:${PORT}`);
console.log(`Serving files from: ${DIST_DIR}`);

serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url);
		let path = resolveFile(url.pathname === "/" ? "/index.html" : url.pathname);

		// SPA fallback for page navigations, 404 for everything else
		if (!path && req.headers.get("accept")?.includes("text/html")) {
			path = resolveFile("/index.html");
		}
		if (!path) {
			return new Response("Not Found (run `bun run build` first?)", {
				status: 404,
				headers: SECURITY_HEADERS,
			});
		}

		const extension = path.split(".").pop();
		return new Response(file(path), {
			headers: {
				"Content-Type": MIME_TYPES[extension] || "application/octet-stream",
				...SECURITY_HEADERS,
			},
		});
	},
});
