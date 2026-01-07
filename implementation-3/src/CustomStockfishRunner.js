
import { StockfishRunner, LEVELS } from "cm-engine-runner/src/StockfishRunner.js"
import { ENGINE_STATE } from "cm-engine-runner/src/EngineRunner.js"

export class CustomStockfishRunner extends StockfishRunner {

    calculateMove(fen, props = { level: 4 }) {
        if (props.skillLevel !== undefined && props.depth !== undefined) {
            this.engineState = ENGINE_STATE.THINKING
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(async () => {
                    resolve()
                }, this.props.responseDelay)
            })
            const calculationPromise = new Promise((resolve) => {
                setTimeout(() => {
                    this.uciCmd('setoption name Skill Level value ' + props.skillLevel)
                    this.uciCmd('position fen ' + fen)
                    this.uciCmd('go depth ' + props.depth)
                    this.moveResponse = (move) => {
                        resolve(move)
                    }
                }, this.props.responseDelay)
            })
            return new Promise((resolve) => {
                Promise.all([this.initialisation, timeoutPromise, calculationPromise]).then((values) => {
                    this.engineState = ENGINE_STATE.READY
                    resolve(values[2])
                })
            })
        } else {
            return super.calculateMove(fen, props)
        }
    }
}
