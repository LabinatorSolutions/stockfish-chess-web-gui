/**
 * Copies the static files the bundler does not pick up into dist/.
 * Any missing source aborts the build instead of shipping a broken board.
 */

import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dist = resolve(root, "dist");
const chessboardAssets = "node_modules/cm-chessboard/assets";

/** [source, destination inside dist/] */
const COPIES = [
	["assets/books", "assets/books"],
	[`${chessboardAssets}/pieces`, "assets/cm-chessboard/pieces"],
	[
		`${chessboardAssets}/extensions/markers/markers.svg`,
		"assets/cm-chessboard/extensions/markers/markers.svg",
	],
	[
		`${chessboardAssets}/extensions/arrows/arrows.svg`,
		"assets/cm-chessboard/extensions/arrows/arrows.svg",
	],
	// Engine worker + .wasm, manifest, icons, _headers, COI service worker
	["public", "."],
];

for (const [from, to] of COPIES) {
	const source = resolve(root, from);
	if (!existsSync(source)) {
		console.error(`copy-assets: missing ${from}`);
		process.exit(1);
	}
	cpSync(source, resolve(dist, to), { recursive: true });
}
console.log(`copy-assets: copied ${COPIES.length} sources into dist/`);
