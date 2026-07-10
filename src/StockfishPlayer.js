// @ts-nocheck -- extends chess-console/cm-engine-runner classes, which ship no type declarations
/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/chess-console-stockfish
 * License: MIT, see file 'LICENSE'
 */

import { Chess } from "chess.mjs/src/Chess.js";
import { CONSOLE_MESSAGE_TOPICS } from "chess-console/src/ChessConsole.js";
import { ChessConsolePlayer } from "chess-console/src/ChessConsolePlayer.js";
import { COLOR, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js";
import { ENGINE_STATE } from "cm-engine-runner/src/EngineRunner.js";
import { PolyglotRunner } from "cm-engine-runner/src/PolyglotRunner.js";
import { Observe } from "cm-web-modules/src/observe/Observe.js";
import { ENGINE_CONFIG } from "./Config.js";
import { CustomStockfishRunner } from "./CustomStockfishRunner.js";

export class StockfishPlayer extends ChessConsolePlayer {
	constructor(chessConsole, name, props) {
		super(chessConsole, name);
		this.props = {
			debug: false,
			skillLevel: ENGINE_CONFIG.DEFAULT_SKILL_LEVEL,
			depth: ENGINE_CONFIG.DEFAULT_DEPTH,
			elo: ENGINE_CONFIG.DEFAULT_ELO,
			moveTime: ENGINE_CONFIG.DEFAULT_MOVE_TIME,
			threads:
				props.threads ||
				chessConsole.persistence.loadValue("threads") ||
				ENGINE_CONFIG.DEFAULT_THREADS,
			gameMode: "pve",
		};
		Object.assign(this.props, props);
		this.engineRunner = new CustomStockfishRunner({
			workerUrl: props.worker,
			debug: props.debug,
		});
		this.openingRunner = props.book
			? new PolyglotRunner({ bookUrl: props.book })
			: this.engineRunner;
		this.state = {
			scoreHistory: {},
			score: null,
			skillLevel: parseInt(props.skillLevel, 10),
			depth: parseInt(props.depth, 10),
			elo: props.elo !== undefined ? parseInt(props.elo, 10) : undefined,
			moveTime:
				props.moveTime !== undefined ? parseInt(props.moveTime, 10) : undefined,
			threads:
				props.threads ||
				chessConsole.persistence.loadValue("threads") ||
				ENGINE_CONFIG.DEFAULT_THREADS,
			searchMode: props.searchMode || "skill",
			gameMode: props.gameMode || "pve",
			engineState: ENGINE_STATE.LOADING,
			currentRunner: this.openingRunner,
		};
		this.initialisation = Promise.all([
			this.openingRunner.initialization,
			this.engineRunner.initialization,
		]);
		this.initialisation.then(() => {
			this.state.engineState = ENGINE_STATE.LOADED;
		});

		this.i18n = chessConsole.i18n;
		this.i18n.load({
			en: {
				score: "Score",
				skillLevel: "Skill Level",
				depth: "Depth",
				engine_failed:
					"Engine failed to find a move. Please try again or undo.",
			},
		});

		this.chessConsole.messageBroker.subscribe(
			CONSOLE_MESSAGE_TOPICS.load,
			() => {
				if (this.chessConsole.persistence.loadValue("skillLevel")) {
					this.state.skillLevel = parseInt(
						this.chessConsole.persistence.loadValue("skillLevel"),
						10,
					);
				}
				if (this.chessConsole.persistence.loadValue("depth")) {
					this.state.depth = parseInt(
						this.chessConsole.persistence.loadValue("depth"),
						10,
					);
				}
				if (this.chessConsole.persistence.loadValue("gameMode")) {
					this.state.gameMode =
						this.chessConsole.persistence.loadValue("gameMode");
				}
				if (this.chessConsole.persistence.loadValue("searchMode")) {
					this.state.searchMode =
						this.chessConsole.persistence.loadValue("searchMode");
				}
				if (this.chessConsole.persistence.loadValue("scoreHistory")) {
					this.state.scoreHistory =
						this.chessConsole.persistence.loadValue("scoreHistory");
					let score =
						this.state.scoreHistory[this.chessConsole.state.plyViewed];
					if (!score && this.chessConsole.state.plyViewed > 0) {
						score =
							this.state.scoreHistory[this.chessConsole.state.plyViewed - 1];
					}
					this.state.score = score;
				}
			},
		);
		this.chessConsole.messageBroker.subscribe(
			CONSOLE_MESSAGE_TOPICS.moveUndone,
			() => {
				this.state.currentRunner = this.openingRunner;
			},
		);
		this.chessConsole.messageBroker.subscribe(
			CONSOLE_MESSAGE_TOPICS.newGame,
			(data) => {
				this.state.scoreHistory = {};
				this.state.score = 0;
				if (data.props?.gameMode) {
					this.state.gameMode = data.props.gameMode;
				}
			},
		);
		this.subscriptionInitGame = this.chessConsole.messageBroker.subscribe(
			CONSOLE_MESSAGE_TOPICS.initGame,
			(data) => {
				if (data.props.engineThreads) {
					this.state.threads = data.props.engineThreads;
				}
				if (data.props.engineSkillLevel) {
					this.state.skillLevel = data.props.engineSkillLevel;
				}
				if (data.props.engineDepth) {
					this.state.depth = data.props.engineDepth;
				}
				if (data.props.engineElo) {
					this.state.elo = data.props.engineElo;
				}
				if (data.props.engineMoveTime) {
					this.state.moveTime = data.props.engineMoveTime;
				}
				if (data.props.engineSearchMode) {
					this.state.searchMode = data.props.engineSearchMode;
				}
				if (data.props.gameMode) {
					this.state.gameMode = data.props.gameMode;
					if (this.props.debug) {
						console.log(
							"StockfishPlayer: gameMode updated to",
							this.state.gameMode,
						);
					}
				}
				if (data.props.playerColor) {
					this.chessConsole.props.playerColor =
						data.props.playerColor === "w" ? COLOR.white : COLOR.black;
				}
				this.state.currentRunner = this.openingRunner;
			},
		);
		Observe.property(this.state, "skillLevel", () => {
			this.chessConsole.persistence.saveValue(
				"skillLevel",
				this.state.skillLevel,
			);
		});
		Observe.property(this.state, "depth", () => {
			this.chessConsole.persistence.saveValue("depth", this.state.depth);
		});
		Observe.property(this.state, "score", () => {
			this.chessConsole.persistence.saveValue("score", this.state.score);
			this.chessConsole.persistence.saveValue(
				"scoreHistory",
				this.state.scoreHistory,
			);
		});
		Observe.property(this.state, "threads", () => {
			this.chessConsole.persistence.saveValue("threads", this.state.threads);
		});
	}

	destroy() {
		this.openingRunner.uciCmd("stop");
		this.engineRunner.uciCmd("stop");
		if (this.openingRunner.engineWorker) {
			this.openingRunner.engineWorker.terminate();
		}
		if (
			this.engineRunner.engineWorker &&
			this.engineRunner.engineWorker !== this.openingRunner.engineWorker
		) {
			this.engineRunner.engineWorker.terminate();
		}
		this.chessConsole.messageBroker.unsubscribe(this.subscriptionInitGame);
	}

	moveRequest(fen, moveResponse) {
		if (this.state.gameMode === "analysis" || this.state.gameMode === "pvp") {
			const turn = this.chessConsole.state.chess.turn();
			const color = turn === "w" ? COLOR.white : COLOR.black;
			if (this.props.debug) {
				console.log("moveRequest (analysis/pvp)", {
					mode: this.state.gameMode,
					turn,
					color,
				});
			}
			if (!this.chessConsole.state.chess.gameOver()) {
				const chessboard = this.chessConsole.components.board.chessboard;
				// Enable move input if not already enabled for the correct color
				const isCorrectColorEnabled =
					(color === COLOR.white && chessboard.state.inputWhiteEnabled) ||
					(color === COLOR.black && chessboard.state.inputBlackEnabled);

				if (!isCorrectColorEnabled) {
					chessboard.enableMoveInput((event) => {
						return this.chessboardMoveInputCallback(event, moveResponse);
					}, color);
				}
			}
			return;
		}

		// PvE Mode: Check if it's the engine's turn
		const turn = this.chessConsole.state.chess.turn();
		const playerColor =
			this.chessConsole.props.playerColor === COLOR.white ? "w" : "b";
		if (turn === playerColor) {
			// It's the player's turn, engine should just enable move input for player
			if (!this.chessConsole.state.chess.gameOver()) {
				const chessboard = this.chessConsole.components.board.chessboard;
				const isCorrectColorEnabled =
					(this.chessConsole.props.playerColor === COLOR.white &&
						chessboard.state.inputWhiteEnabled) ||
					(this.chessConsole.props.playerColor === COLOR.black &&
						chessboard.state.inputBlackEnabled);

				if (!isCorrectColorEnabled) {
					chessboard.enableMoveInput((event) => {
						return this.chessboardMoveInputCallback(event, moveResponse);
					}, this.chessConsole.props.playerColor);
				}
			}
			return;
		}

		if (this.props.debug) {
			console.log("moveRequest", fen);
		}
		this.initialisation.then(async () => {
			this.state.engineState = ENGINE_STATE.THINKING;
			// Ensure only the relevant parameter for the searchMode is passed
			const searchParams = {
				threads: this.state.threads,
			};
			if (this.state.searchMode === "skill") {
				searchParams.skillLevel = this.state.skillLevel;
			} else if (this.state.searchMode === "elo") {
				searchParams.elo = this.state.elo;
			} else if (this.state.searchMode === "depth") {
				searchParams.depth = this.state.depth;
			} else if (this.state.searchMode === "time") {
				searchParams.moveTime = this.state.moveTime;
			}

			const nextMove = await this.state.currentRunner.calculateMove(
				fen,
				searchParams,
			);
			if (!nextMove) {
				if (this.props.debug) {
					console.log(
						"no move found with",
						this.state.currentRunner.constructor.name,
					);
				}
				if (this.state.currentRunner === this.openingRunner) {
					this.state.currentRunner = this.engineRunner;
					this.moveRequest(fen, moveResponse);
				} else {
					console.error("Engine failed to find a move", fen);
					this.chessConsole.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.info, {
						message: this.chessConsole.i18n.t("engine_failed"),
					});
					this.state.engineState = ENGINE_STATE.READY;
					moveResponse(null);
				}
			} else {
				if (this.props.debug) {
					console.log("this.state.currentRunner", this.state.currentRunner);
					console.log(
						"nextMove",
						nextMove,
						this.state.currentRunner.constructor.name,
					);
				}
				let newScore;
				if (nextMove.score !== undefined) {
					if (!Number.isNaN(nextMove.score)) {
						// Standardize to White's Perspective
						const turn = this.chessConsole.state.chess.turn();
						if (turn === "w") {
							newScore = nextMove.score;
						} else {
							newScore = -nextMove.score;
						}
					} else {
						newScore = nextMove.score;
					}
					this.state.scoreHistory[this.chessConsole.state.chess.plyCount()] =
						newScore;
					this.state.score = newScore;
				} else {
					this.state.score = undefined;
				}
				this.state.engineState = ENGINE_STATE.READY;
				moveResponse(nextMove);
			}
		});
	}

	validateMoveAndPromote(fen, squareFrom, squareTo, callback) {
		const tmpChess = new Chess(fen);
		const move = { from: squareFrom, to: squareTo };
		const moveResult = tmpChess.move(move);
		if (moveResult) {
			callback(moveResult);
			return true;
		} else {
			// is a promotion?
			if (tmpChess.get(squareFrom) && tmpChess.get(squareFrom).type === "p") {
				const possibleMoves = tmpChess.moves({
					square: squareFrom,
					verbose: true,
				});
				for (const possibleMove of possibleMoves) {
					if (possibleMove.to === squareTo && possibleMove.promotion) {
						const chessboard = this.chessConsole.components.board.chessboard;
						chessboard.showPromotionDialog(
							squareTo,
							tmpChess.turn(),
							(event) => {
								if (event.piece) {
									move.promotion = event.piece.charAt(1);
									callback(tmpChess.move(move));
								} else {
									callback(null);
								}
							},
						);
						return true;
					}
				}
			}
		}
		callback(null);
		return false;
	}

	chessboardMoveInputCallback(event, moveResponse) {
		const gameFen = this.chessConsole.state.chess.fen();
		if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
			return this.validateMoveAndPromote(
				gameFen,
				event.squareFrom,
				event.squareTo,
				(moveResult) => {
					let result;
					if (moveResult) {
						// valid
						result = moveResponse(moveResult);
					} else {
						// not valid
						result = moveResponse({
							from: event.squareFrom,
							to: event.squareTo,
						});
					}
					if (result) {
						this.chessConsole.components.board.chessboard.disableMoveInput();
					}
				},
			);
		} else if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
			if (
				this.chessConsole.state.plyViewed !==
				this.chessConsole.state.chess.plyCount()
			) {
				this.chessConsole.state.plyViewed =
					this.chessConsole.state.chess.plyCount();
				return false;
			} else {
				const possibleMoves = this.chessConsole.state.chess.moves({
					square: event.square,
				});
				if (possibleMoves.length > 0) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
}
