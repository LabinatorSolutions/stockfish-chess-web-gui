// @ts-nocheck -- extends cm-engine-runner's StockfishRunner, which ships no type declarations
import { ENGINE_STATE } from "cm-engine-runner/src/EngineRunner.js";
import { StockfishRunner } from "cm-engine-runner/src/StockfishRunner.js";

export class CustomStockfishRunner extends StockfishRunner {
	calculateMove(fen, props = { skillLevel: 20, depth: 16 }) {
		this.engineState = ENGINE_STATE.THINKING;
		return new Promise((resolve) => {
			setTimeout(async () => {
				await this.initialized;
				if (props.threads !== undefined) {
					this.uciCmd(`setoption name Threads value ${props.threads}`);
				}
				if (props.elo !== undefined) {
					this.uciCmd("setoption name UCI_LimitStrength value true");
					this.uciCmd(`setoption name UCI_Elo value ${props.elo}`);
				} else {
					this.uciCmd("setoption name UCI_LimitStrength value false");
					if (props.skillLevel !== undefined) {
						this.uciCmd(`setoption name Skill Level value ${props.skillLevel}`);
					}
				}
				this.uciCmd(`position fen ${fen}`);
				if (props.moveTime !== undefined) {
					this.uciCmd(`go movetime ${props.moveTime}`);
				} else {
					this.uciCmd(`go depth ${props.depth || 16}`);
				}
				this.moveResponse = (move) => {
					this.engineState = ENGINE_STATE.READY;
					resolve(move);
				};
			}, this.props.responseDelay);
		});
	}

	static parseInfoLine(line) {
		// Extract Score
		let score = "n/a";
		let scoreRaw = 0;
		if (line.includes("score cp")) {
			const match = line.match(/score cp (-?\d+)/);
			if (match) {
				scoreRaw = parseInt(match[1], 10);
				score = (scoreRaw / 100).toFixed(2);
				if (scoreRaw > 0) score = `+${score}`;
			}
		} else if (line.includes("score mate")) {
			const match = line.match(/score mate (-?\d+)/);
			if (match) {
				scoreRaw = parseInt(match[1], 10) * 10000; // Huge value
				score = `M${match[1]}`;
			}
		}

		// Extract Depth
		const depthMatch = line.match(/depth (\d+)/);
		const depth = depthMatch ? depthMatch[1] : "?";

		// Extract PV
		const pvIndex = line.indexOf(" pv ");
		const pvRaw = pvIndex !== -1 ? line.substring(pvIndex + 4) : "";
		const pvArray = pvRaw.split(" ");
		const pvtruncated = pvArray.slice(0, 5).join(" ");

		return {
			score,
			scoreRaw,
			depth,
			pv: pvtruncated,
			pvArray,
		};
	}
}
