/**
 * Application Configuration
 */

export const ENGINE_CONFIG = {
	// Engine static files
	WORKER_PATH: "./engine/stockfish-19-lite.js",
	BOOK_PATH: "./assets/books/openings.bin",

	// Default Engine Settings
	DEFAULT_SKILL_LEVEL: 20,
	DEFAULT_DEPTH: 16,
	DEFAULT_DEBUG: true,
	DEFAULT_ANALYSIS_DEPTH: 18,
	ANALYSIS_SKILL_LEVEL: 20,
	DEFAULT_ELO: 1320,
	DEFAULT_MOVE_TIME: 1000, // ms

	// Ranges
	MIN_SKILL_LEVEL: 1,
	MAX_SKILL_LEVEL: 20,
	MIN_DEPTH: 1,
	MAX_DEPTH: 36,
	MIN_ANALYSIS_DEPTH: 16,
	MAX_ANALYSIS_DEPTH: 36,
	MIN_ELO: 1320,
	MAX_ELO: 3190,
	MIN_MOVE_TIME: 100,
	MAX_MOVE_TIME: 10000,
	DEFAULT_THREADS: navigator.hardwareConcurrency || 4,
};

export const GAME_CONFIG = {
	START_FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	SAVE_PREFIX: "Stockfish",
};

export const STYLING_CONFIG = {
	DEFAULT_THEME: "brown-wood",
	DEFAULT_PIECES: "standard",
	THEMES: [
		{ id: "black-stone", name: "Black Stone" },
		{ id: "blue-sky", name: "Blue Sky" },
		{ id: "brown-wood", name: "Brown Wood" },
		{ id: "bw-paper", name: "B&W Paper" },
		{ id: "gray-iron", name: "Gray Iron" },
		{ id: "green-forest", name: "Green Forest" },
		{ id: "navy-ocean", name: "Navy Ocean" },
		{ id: "pink-bubblegum", name: "Pink Bubblegum" },
		{ id: "purple-mist", name: "Purple Mist" },
		{ id: "red-wine", name: "Red Wine" },
		{ id: "teal-pond", name: "Teal Pond" },
		{ id: "yellow-sand", name: "Yellow Sand" },
	],
	PIECE_SETS: [
		{ id: "standard", name: "Standard (Wikipedia)" },
		{ id: "staunty", name: "Staunty" },
	],
};
