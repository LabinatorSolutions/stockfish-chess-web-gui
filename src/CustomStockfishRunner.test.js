import { describe, expect, test } from "bun:test";
import { CustomStockfishRunner } from "./CustomStockfishRunner.js";

describe("CustomStockfishRunner.parseInfoLine", () => {
	test("parses a positive centipawn score", () => {
		const line =
			"info depth 20 seldepth 28 multipv 1 score cp 34 nodes 123456 nps 500000 pv e2e4 e7e5 g1f3 g8f6 f1c4";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.score).toBe("+0.34");
		expect(result.scoreRaw).toBe(34);
		expect(result.depth).toBe("20");
		expect(result.pv).toBe("e2e4 e7e5 g1f3 g8f6 f1c4");
	});

	test("parses a negative centipawn score", () => {
		const line = "info depth 10 score cp -150 pv d7d5";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.score).toBe("-1.50");
		expect(result.scoreRaw).toBe(-150);
	});

	test("parses a positive mate score", () => {
		const line = "info depth 5 score mate 3 pv e2e4 e7e5 f1c4";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.score).toBe("M3");
		expect(result.scoreRaw).toBe(30000);
	});

	test("parses a negative mate score", () => {
		const line = "info depth 5 score mate -2 pv h2h3";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.score).toBe("M-2");
		expect(result.scoreRaw).toBe(-20000);
	});

	test("falls back to n/a when no score is present", () => {
		const line = "info string some engine message";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.score).toBe("n/a");
		expect(result.scoreRaw).toBe(0);
		expect(result.depth).toBe("?");
	});

	test("truncates the pv string to 5 moves but keeps the full pvArray", () => {
		const line =
			"info depth 15 score cp 10 pv e2e4 e7e5 g1f3 g8f6 f1c4 f8c5 c2c3 g8f6";
		const result = CustomStockfishRunner.parseInfoLine(line);
		expect(result.pv).toBe("e2e4 e7e5 g1f3 g8f6 f1c4");
		expect(result.pvArray).toHaveLength(8);
	});
});
