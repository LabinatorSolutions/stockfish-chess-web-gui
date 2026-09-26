/**
 * Adds the tags Bun's HTML bundler cannot emit to dist/index.html.
 *
 * Classic <script> tags in index.html get folded into the deferred module
 * bundle, but these two must run as classic scripts before the page renders:
 * theme-init.js to avoid a light-theme flash, and coi-serviceworker.js,
 * which reads document.currentScript (null inside a module).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const indexPath = resolve(import.meta.dir, "..", "dist", "index.html");
const TAGS = [
	'<link rel="apple-touch-icon" href="./icon-192.png">',
	'<link rel="manifest" href="./manifest.json">',
	'<script src="./theme-init.js"></script>',
	'<script src="./coi-serviceworker.js"></script>',
].join("");

const html = readFileSync(indexPath, "utf8");
if (html.includes('src="./theme-init.js"')) {
	console.log("inject-static-tags: already injected");
	process.exit(0);
}
if (!html.includes("</head>")) {
	console.error("inject-static-tags: no </head> in dist/index.html");
	process.exit(1);
}
writeFileSync(indexPath, html.replace("</head>", `${TAGS}</head>`));
console.log("inject-static-tags: done");
