/**
 * Validation for user-supplied FEN and PGN, run before anything reaches
 * chessConsole.newGame(). An invalid position otherwise loads half-way
 * (empty board, bogus "Stalemate") and can be sent to the engine, which
 * does not guard against illegal positions.
 */

import { Chess as ChessJs } from "chess.mjs/src/Chess.js";
import { Chess } from "cm-chess/src/Chess.js";

/**
 * @param {string} input
 * @returns {{ fen: string, error?: undefined } | { fen?: undefined, error: string }}
 */
export function parseFen(input) {
	const fields = input.trim().split(/\s+/);
	// Accept the common 4-field form without move counters
	if (fields.length === 4) fields.push("0", "1");
	const fen = fields.join(" ");

	const { valid, error } = new ChessJs().validate_fen(fen);
	if (!valid) return { error };

	const ranks = fields[0].split("/");
	if (fields[0].split("K").length !== 2 || fields[0].split("k").length !== 2) {
		return { error: "Each side must have exactly one king." };
	}
	if (/[pP]/.test(ranks[0]) || /[pP]/.test(ranks[7])) {
		return { error: "Pawns cannot stand on the first or last rank." };
	}
	// The side that just moved must not be left in check
	const flipped = [
		fields[0],
		fields[1] === "w" ? "b" : "w",
		fields[2],
		"-",
		fields[4],
		fields[5],
	].join(" ");
	if (new ChessJs(flipped).in_check()) {
		return { error: "The side not to move is in check." };
	}
	return { fen };
}

/** The PGN shape chess-console accepts for a bare position (no "*"). */
export function fenToPgn(fen) {
	return `[FEN "${fen}"]\n[SetUp "1"]\n\n `;
}

/**
 * @param {string} pgn
 * @returns {string | null} an error message, or null when the PGN loads
 */
export function checkPgn(pgn) {
	try {
		new Chess().loadPgn(pgn, true);
		return null;
	} catch (e) {
		// The PGN parser throws plain objects for illegal moves
		if (e?.notation) return `Illegal move: ${e.notation}`;
		return e?.message || "Invalid PGN.";
	}
}
