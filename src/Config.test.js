import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { ENGINE_CONFIG, GAME_CONFIG, STYLING_CONFIG } from "./Config.js";

describe("ENGINE_CONFIG", () => {
	test("default values fall within their configured ranges", () => {
		expect(ENGINE_CONFIG.DEFAULT_SKILL_LEVEL).toBeGreaterThanOrEqual(
			ENGINE_CONFIG.MIN_SKILL_LEVEL,
		);
		expect(ENGINE_CONFIG.DEFAULT_SKILL_LEVEL).toBeLessThanOrEqual(
			ENGINE_CONFIG.MAX_SKILL_LEVEL,
		);
		expect(ENGINE_CONFIG.DEFAULT_DEPTH).toBeGreaterThanOrEqual(
			ENGINE_CONFIG.MIN_DEPTH,
		);
		expect(ENGINE_CONFIG.DEFAULT_DEPTH).toBeLessThanOrEqual(
			ENGINE_CONFIG.MAX_DEPTH,
		);
		expect(ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH).toBeGreaterThanOrEqual(
			ENGINE_CONFIG.MIN_ANALYSIS_DEPTH,
		);
		expect(ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH).toBeLessThanOrEqual(
			ENGINE_CONFIG.MAX_ANALYSIS_DEPTH,
		);
		expect(ENGINE_CONFIG.DEFAULT_ELO).toBeGreaterThanOrEqual(
			ENGINE_CONFIG.MIN_ELO,
		);
		expect(ENGINE_CONFIG.DEFAULT_ELO).toBeLessThanOrEqual(
			ENGINE_CONFIG.MAX_ELO,
		);
		expect(ENGINE_CONFIG.DEFAULT_MOVE_TIME).toBeGreaterThanOrEqual(
			ENGINE_CONFIG.MIN_MOVE_TIME,
		);
		expect(ENGINE_CONFIG.DEFAULT_MOVE_TIME).toBeLessThanOrEqual(
			ENGINE_CONFIG.MAX_MOVE_TIME,
		);
	});

	test("WORKER_PATH and its .wasm exist in public/", () => {
		const worker = new URL(
			`../public/${ENGINE_CONFIG.WORKER_PATH}`,
			import.meta.url,
		);
		expect(existsSync(worker)).toBe(true);
		expect(existsSync(new URL(worker.href.replace(/\.js$/, ".wasm")))).toBe(
			true,
		);
	});

	test("NAME carries the same major version as the worker file", () => {
		const nameVersion = ENGINE_CONFIG.NAME.match(/\d+/)?.[0];
		const workerVersion =
			ENGINE_CONFIG.WORKER_PATH.match(/stockfish-(\d+)/)?.[1];
		expect(nameVersion).toBeDefined();
		expect(nameVersion).toBe(workerVersion);
	});
});

describe("STYLING_CONFIG", () => {
	test("default theme exists in the THEMES list", () => {
		const ids = STYLING_CONFIG.THEMES.map((t) => t.id);
		expect(ids).toContain(STYLING_CONFIG.DEFAULT_THEME);
	});

	test("default piece set exists in the PIECE_SETS list", () => {
		const ids = STYLING_CONFIG.PIECE_SETS.map((p) => p.id);
		expect(ids).toContain(STYLING_CONFIG.DEFAULT_PIECES);
	});

	test("theme ids are unique", () => {
		const ids = STYLING_CONFIG.THEMES.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("GAME_CONFIG", () => {
	test("START_FEN has 8 ranks", () => {
		const boardPart = GAME_CONFIG.START_FEN.split(" ")[0];
		expect(boardPart.split("/")).toHaveLength(8);
	});
});
