import { describe, expect, test } from "bun:test";
import { checkPgn, fenToPgn, parseFen } from "./GameImport.js";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("parseFen", () => {
	test("accepts a full FEN", () => {
		expect(parseFen(START)).toEqual({ fen: START });
	});

	test("trims whitespace and completes a 4-field FEN", () => {
		expect(
			parseFen("  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -  "),
		).toEqual({ fen: START });
	});

	test.each([
		["garbage", "not a fen"],
		["no kings", "8/8/8/8/8/8/8/8 w - - 0 1"],
		["two white kings", "4k3/8/8/8/8/8/8/3KK3 w - - 0 1"],
		["pawn on the back rank", "4k2P/8/8/8/8/8/8/4K3 w - - 0 1"],
		["side not to move in check", "4k3/8/8/8/8/8/8/4R1K1 w - - 0 1"],
	])("rejects %s", (_name, fen) => {
		expect(parseFen(fen).error).toBeString();
	});
});

describe("checkPgn", () => {
	test("accepts a normal game, with or without a result token", () => {
		expect(checkPgn("1. e4 e5 2. Nf3 Nc6")).toBeNull();
		expect(checkPgn("1. e4 e5 *")).toBeNull();
		expect(checkPgn('[Event "x"]\n\n1. e4 e5 1/2-1/2')).toBeNull();
	});

	test("accepts the PGN built from a FEN", () => {
		expect(checkPgn(fenToPgn("4k3/8/8/8/8/8/8/4K3 w - - 0 1"))).toBeNull();
	});

	test("reports illegal moves and syntax errors", () => {
		expect(checkPgn("1. e4 e5 2. Ke3")).toBe("Illegal move: Ke3");
		expect(checkPgn("1. e4 e5 2. Qxz9")).toBeString();
	});
});
