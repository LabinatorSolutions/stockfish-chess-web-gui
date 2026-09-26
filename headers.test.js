import { describe, expect, test } from "bun:test";
import { parseHeaders, SECURITY_HEADERS } from "./headers.js";

describe("parseHeaders", () => {
	test("reads only the /* block and ignores comments", () => {
		const text = [
			"# comment",
			"/*",
			"  A: 1",
			"  B: x: y",
			"/other",
			"  C: 3",
		].join("\n");
		expect(parseHeaders(text)).toEqual({ A: "1", B: "x: y" });
	});
});

describe("public/_headers", () => {
	test("enables cross-origin isolation for multi-threaded WASM", () => {
		expect(SECURITY_HEADERS["Cross-Origin-Opener-Policy"]).toBe("same-origin");
		expect(SECURITY_HEADERS["Cross-Origin-Embedder-Policy"]).toBe(
			"require-corp",
		);
	});

	test("CSP allows WASM compilation and same-origin workers only", () => {
		const csp = SECURITY_HEADERS["Content-Security-Policy"];
		expect(csp).toContain("script-src 'self' 'wasm-unsafe-eval'");
		expect(csp).toContain("worker-src 'self' blob:");
		expect(csp).toContain("default-src 'self'");
	});
});
