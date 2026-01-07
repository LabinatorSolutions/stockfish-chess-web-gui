/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/chess-console-stockfish
 * License: MIT, see file 'LICENSE'
 */

import { ChessConsolePlayer } from "chess-console/src/ChessConsolePlayer.js"
import { Observe } from "cm-web-modules/src/observe/Observe.js"
import { CONSOLE_MESSAGE_TOPICS } from "chess-console/src/ChessConsole.js"
import { PolyglotRunner } from "cm-engine-runner/src/PolyglotRunner.js"
import { ENGINE_STATE } from "cm-engine-runner/src/EngineRunner.js"
import { CustomStockfishRunner } from "./CustomStockfishRunner.js"
import { ENGINE_CONFIG } from "./Config.js"
import { COLOR, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js"
import { Chess } from "chess.mjs/src/Chess.js"

export class StockfishPlayer extends ChessConsolePlayer {

    constructor(chessConsole, name, props) {
        super(chessConsole, name)
        this.props = {
            debug: false,
            skillLevel: ENGINE_CONFIG.DEFAULT_SKILL_LEVEL,
            depth: ENGINE_CONFIG.DEFAULT_DEPTH,
            gameMode: "pve"
        }
        Object.assign(this.props, props)
        this.engineRunner = new CustomStockfishRunner({ workerUrl: props.worker, debug: props.debug })
        this.openingRunner = props.book ? new PolyglotRunner({ bookUrl: props.book }) : this.engineRunner
        this.state = {
            scoreHistory: {},
            score: null,
            skillLevel: parseInt(props.skillLevel, 10),
            depth: parseInt(props.depth, 10),
            gameMode: props.gameMode || "pve",
            engineState: ENGINE_STATE.LOADING,
            currentRunner: this.openingRunner
        }
        this.initialisation = Promise.all([this.openingRunner.initialization, this.engineRunner.initialization])
        this.initialisation.then(() => {
            this.state.engineState = ENGINE_STATE.LOADED
        })

        this.i18n = chessConsole.i18n
        this.i18n.load({
            en: {
                score: "Score",
                skillLevel: "Skill Level",
                depth: "Depth"
            }
        })

        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.load, () => {
            if (this.chessConsole.persistence.loadValue("skillLevel")) {
                this.state.skillLevel = parseInt(this.chessConsole.persistence.loadValue("skillLevel"), 10)
            }
            if (this.chessConsole.persistence.loadValue("depth")) {
                this.state.depth = parseInt(this.chessConsole.persistence.loadValue("depth"), 10)
            }
            if (this.chessConsole.persistence.loadValue("gameMode")) {
                this.state.gameMode = this.chessConsole.persistence.loadValue("gameMode")
            }
            if (this.chessConsole.persistence.loadValue("scoreHistory")) {
                this.state.scoreHistory = this.chessConsole.persistence.loadValue("scoreHistory")
                let score = this.state.scoreHistory[this.chessConsole.state.plyViewed]
                if (!score && this.chessConsole.state.plyViewed > 0) {
                    score = this.state.scoreHistory[this.chessConsole.state.plyViewed - 1]
                }
                this.state.score = score
            }
        })
        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveUndone, () => {
            this.state.currentRunner = this.openingRunner
        })
        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.newGame, (data) => {
            this.state.scoreHistory = {}
            this.state.score = 0
            if (data.props && data.props.gameMode) {
                this.state.gameMode = data.props.gameMode
            }
        })
        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.initGame, (data) => {
            if (data.props.engineSkillLevel) {
                this.state.skillLevel = data.props.engineSkillLevel
            }
            if (data.props.engineDepth) {
                this.state.depth = data.props.engineDepth
            }
            if (data.props.gameMode) {
                this.state.gameMode = data.props.gameMode
            }
            this.state.currentRunner = this.openingRunner
        })
        Observe.property(this.state, "skillLevel", () => {
            this.chessConsole.persistence.saveValue("skillLevel", this.state.skillLevel)
        })
        Observe.property(this.state, "depth", () => {
            this.chessConsole.persistence.saveValue("depth", this.state.depth)
        })
        Observe.property(this.state, "score", () => {
            this.chessConsole.persistence.saveValue("score", this.state.score)
            this.chessConsole.persistence.saveValue("scoreHistory", this.state.scoreHistory)
        })
    }

    moveRequest(fen, moveResponse) {
        if (this.state.gameMode === "analysis") {
            const color = this.chessConsole.state.chess.turn() === 'w' ? COLOR.white : COLOR.black
            if (!this.chessConsole.state.chess.gameOver()) {
                if (!this.chessConsole.components.board.chessboard.isMoveInputEnabled()) {
                    this.chessConsole.components.board.chessboard.enableMoveInput(
                        (event) => {
                            return this.chessboardMoveInputCallback(event, moveResponse)
                        }, color
                    )
                }
            }
            return
        }

        if (this.props.debug) {
            console.log("moveRequest", fen)
        }
        this.initialisation.then(async () => {
            this.state.engineState = ENGINE_STATE.THINKING
            let nextMove = await this.state.currentRunner.calculateMove(fen, { skillLevel: this.state.skillLevel, depth: this.state.depth })
            if (!nextMove) {
                if (this.props.debug) {
                    console.log("no move found with", this.state.currentRunner.constructor.name)
                }
                if (this.state.currentRunner === this.openingRunner) {
                    this.state.currentRunner = this.engineRunner
                    this.moveRequest(fen, moveResponse)
                } else {
                    throw new Error("can't find move with fen " + fen + " and runner " + this.state.currentRunner)
                }
            } else {
                if (this.props.debug) {
                    console.log("this.state.currentRunner", this.state.currentRunner)
                    console.log("nextMove", nextMove, this.state.currentRunner.constructor.name)
                }
                let newScore = undefined
                if (nextMove.score !== undefined) {
                    if (!isNaN(nextMove.score)) {
                        // newScore = this.chessConsole.props.playerColor === COLOR.white ? -nextMove.score : nextMove.score
                        newScore = -nextMove.score
                    } else {
                        newScore = nextMove.score
                    }
                    this.state.scoreHistory[this.chessConsole.state.chess.plyCount()] = newScore
                    this.state.score = newScore
                } else {
                    this.state.score = undefined
                }
                this.state.engineState = ENGINE_STATE.READY
                moveResponse(nextMove)
            }
        })
    }

    validateMoveAndPromote(fen, squareFrom, squareTo, callback) {
        const tmpChess = new Chess(fen)
        let move = { from: squareFrom, to: squareTo }
        const moveResult = tmpChess.move(move)
        if (moveResult) {
            callback(moveResult)
            return true
        } else { // is a promotion?
            if (tmpChess.get(squareFrom) && tmpChess.get(squareFrom).type === "p") {
                const possibleMoves = tmpChess.moves({ square: squareFrom, verbose: true })
                for (let possibleMove of possibleMoves) {
                    if (possibleMove.to === squareTo && possibleMove.promotion) {
                        const chessboard = this.chessConsole.components.board.chessboard
                        chessboard.showPromotionDialog(squareTo, tmpChess.turn(), (event) => {
                            if (event.piece) {
                                move.promotion = event.piece.charAt(1)
                                callback(tmpChess.move(move))
                            } else {
                                callback(null)
                            }
                        })
                        return true
                    }
                }
            }
        }
        callback(null)
        return false
    }

    chessboardMoveInputCallback(event, moveResponse) {
        const gameFen = this.chessConsole.state.chess.fen()
        if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
            return this.validateMoveAndPromote(gameFen, event.squareFrom, event.squareTo, (moveResult) => {
                let result
                if (moveResult) { // valid
                    result = moveResponse(moveResult)
                } else { // not valid
                    result = moveResponse({ from: event.squareFrom, to: event.squareTo })
                }
                if (result) {
                    this.chessConsole.components.board.chessboard.disableMoveInput()
                }
            })
        } else if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
            if (this.chessConsole.state.plyViewed !== this.chessConsole.state.chess.plyCount()) {
                this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount()
                return false
            } else {
                const possibleMoves = this.chessConsole.state.chess.moves({ square: event.square })
                if (possibleMoves.length > 0) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
}
