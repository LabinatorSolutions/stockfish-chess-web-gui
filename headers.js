/**
 * public/_headers is the single source for the security headers: Netlify
 * serves it from dist/, and server.js reads it through this module.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Parses the "/*" block of a Netlify-style _headers file.
 * @param {string} text
 * @returns {Record<string, string>}
 */
export function parseHeaders(text) {
	/** @type {Record<string, string>} */
	const headers = {};
	let inWildcardBlock = false;
	for (const raw of text.split("\n")) {
		const line = raw.trimEnd();
		if (!line.trim() || line.trim().startsWith("#")) continue;
		if (!/^\s/.test(line)) {
			// A path line opens a new block
			inWildcardBlock = line.trim() === "/*";
			continue;
		}
		if (!inWildcardBlock) continue;
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
	}
	return headers;
}

export const SECURITY_HEADERS = parseHeaders(
	readFileSync(resolve(import.meta.dir, "public", "_headers"), "utf8"),
);
