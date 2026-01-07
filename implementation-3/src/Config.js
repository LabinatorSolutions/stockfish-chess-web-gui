/**
 * Application Configuration
 */

export const ENGINE_CONFIG = {
	// Engine static files
	WORKER_PATH: "/engine/stockfish-17.1-8e4d048.js",
	BOOK_PATH: "./assets/books/openings.bin",

	// Default Engine Settings
	DEFAULT_SKILL_LEVEL: 20,
	DEFAULT_DEPTH: 16,
	DEFAULT_DEBUG: true,
	DEFAULT_ANALYSIS_DEPTH: 18,
	ANALYSIS_SKILL_LEVEL: 20,

	// Ranges
	MIN_SKILL_LEVEL: 1,
	MAX_SKILL_LEVEL: 20,
	MIN_DEPTH: 1,
	MAX_DEPTH: 36,
	MIN_ANALYSIS_DEPTH: 16,
	MAX_ANALYSIS_DEPTH: 36
}

export const GAME_CONFIG = {
	START_FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	SAVE_PREFIX: "Stockfish"
}
