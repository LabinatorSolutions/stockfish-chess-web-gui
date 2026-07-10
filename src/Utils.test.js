import { describe, expect, test } from "bun:test";
import { escapeHtml } from "./Utils.js";

describe("escapeHtml", () => {
	test("returns empty string for undefined and null", () => {
		expect(escapeHtml(undefined)).toBe("");
		expect(escapeHtml(null)).toBe("");
	});

	test("escapes all special characters", () => {
		expect(escapeHtml(`&<>"'/`)).toBe("&amp;&lt;&gt;&quot;&#039;&#x2F;");
	});

	test("escapes script tags", () => {
		expect(escapeHtml("<script>alert(1)</script>")).toBe(
			"&lt;script&gt;alert(1)&lt;&#x2F;script&gt;",
		);
	});

	test("leaves plain text unchanged", () => {
		expect(escapeHtml("e2e4 Nf3")).toBe("e2e4 Nf3");
	});

	test("coerces non-string input", () => {
		expect(escapeHtml(123)).toBe("123");
	});
});
