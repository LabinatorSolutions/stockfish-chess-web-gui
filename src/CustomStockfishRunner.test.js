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

	test("returns an empty pvArray when the line has no pv", () => {
		const result = CustomStockfishRunner.parseInfoLine(
			"info depth 0 score mate 0",
		);
		expect(result.pvArray).toEqual([]);
		expect(result.pv).toBe("");
	});

	test("reads depth, not seldepth", () => {
		const result = CustomStockfishRunner.parseInfoLine(
			"info seldepth 30 depth 12 score cp 5 pv e2e4",
		);
		expect(result.depth).toBe("12");
	});
});

describe("CustomStockfishRunner.calculateMove", () => {
	// Bypass the constructor, which would spawn a real engine Worker.
	const makeRunner = () => {
		const runner = Object.create(CustomStockfishRunner.prototype);
		runner.props = { responseDelay: 0 };
		runner.initialized = Promise.resolve();
		runner.sent = [];
		runner.uciCmd = (cmd) => runner.sent.push(cmd);
		return runner;
	};
	const search = async (runner, props) => {
		runner.sent = [];
		const move = runner.calculateMove("startpos-fen", props);
		await new Promise((resolve) => setTimeout(resolve, 5));
		runner.moveResponse({ from: "e2", to: "e4" });
		await move;
		return runner.sent;
	};

	test("elo mode limits strength and sets UCI_Elo", async () => {
		const sent = await search(makeRunner(), { elo: 1500 });
		expect(sent).toContain("setoption name UCI_LimitStrength value true");
		expect(sent).toContain("setoption name UCI_Elo value 1500");
		expect(sent.at(-1)).toBe("go depth 16");
	});

	test("depth and time modes reset Skill Level to full strength", async () => {
		const runner = makeRunner();
		await search(runner, { skillLevel: 3 });
		const depthSent = await search(runner, { depth: 12 });
		expect(depthSent).toContain("setoption name Skill Level value 20");
		expect(depthSent.at(-1)).toBe("go depth 12");
		const timeSent = await search(runner, { moveTime: 500 });
		expect(timeSent).toContain("setoption name Skill Level value 20");
		expect(timeSent.at(-1)).toBe("go movetime 500");
	});

	test("sends Threads only when it changes", async () => {
		const runner = makeRunner();
		expect(await search(runner, { threads: 4 })).toContain(
			"setoption name Threads value 4",
		);
		expect(
			(await search(runner, { threads: 4 })).some((c) => c.includes("Threads")),
		).toBe(false);
		expect(await search(runner, { threads: 2 })).toContain(
			"setoption name Threads value 2",
		);
	});
});
