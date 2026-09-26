// @ts-nocheck -- uses cm-engine-runner's CustomStockfishRunner, which ships no type declarations
/**
 * Component for handling separate Stockfish analysis.
 */

import { Chess } from "chess.mjs/src/Chess.js";
import { ARROW_TYPE } from "cm-chessboard/src/extensions/arrows/Arrows.js";
import { ENGINE_CONFIG } from "./Config.js";
import { CustomStockfishRunner } from "./CustomStockfishRunner.js";

import { escapeHtml } from "./Utils.js";

export class StockfishAnalysis {
	constructor(container, props = {}) {
		this.container = container;
		this.board = props.board; // New: Accept board instance
		this.props = {
			worker: ENGINE_CONFIG.WORKER_PATH,
			depth: ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH,
			skillLevel: ENGINE_CONFIG.ANALYSIS_SKILL_LEVEL,
			multiPV: 2, // Fixed at 2 lines
			...props,
		};
		this.runner = new CustomStockfishRunner({
			workerUrl: this.props.worker,
			debug: false,
		});
		this.lines = {};
		this.showArrows = false; // Default off

		// i18n support
		// Fallback if no i18n provided
		this.i18n = props.i18n || {
			t: (key) => key,
			load: () => Promise.resolve(),
		};
		this.i18n.load({
			en: {
				analysis_title: "Analysis",
				analysis_eval: "Eval",
				analysis_depth: "D",
				analysis_line: "Line",
			},
		});

		this.runner.initialized.then(() => {
			console.log("Analysis Engine Initialized");
		});

		// Create UI elements
		this.renderUI();

		// A new search is only started once the previous one has confirmed its
		// stop with "bestmove"; until then its late "info" lines describe the old
		// position and must not be drawn against the new one.
		this.searching = false;
		this.pendingFen = null;

		// Bind worker listener
		this.workerListener = (e) => {
			const line = e.data;
			if (typeof line !== "string") return;
			if (line.startsWith("bestmove")) {
				this.searching = false;
				if (this.pendingFen) this.startSearch();
			} else if (
				!this.pendingFen &&
				line.startsWith("info") &&
				line.includes(" pv ")
			) {
				this.updateDisplay(line);
			}
		};
	}

	renderUI() {
		this.container.innerHTML = ""; // Clear container

		// Control Bar
		const controls = document.createElement("div");
		controls.className =
			"d-flex justify-content-between align-items-center mb-2";

		const title = document.createElement("strong");
		title.innerText = this.i18n.t("analysis_title");
		controls.appendChild(title);

		// Arrow Toggle
		const toggleContainer = document.createElement("div");
		toggleContainer.className = "form-check form-switch ms-2";
		toggleContainer.innerHTML = `
            <input class="form-check-input" type="checkbox" id="toggle-analysis-arrows">
            <label class="form-check-label small" for="toggle-analysis-arrows">Arrows</label>
        `;
		const toggleInput = toggleContainer.querySelector("input");
		toggleInput.checked = this.showArrows;
		toggleInput.addEventListener("change", (e) => {
			this.showArrows = e.target.checked;
			this.setShowArrows(e.target.checked);
		});
		controls.appendChild(toggleContainer);

		this.container.appendChild(controls);

		// Output Area (Table)
		this.outputTable = document.createElement("table");
		this.outputTable.className = "table table-sm table-striped mt-1";
		this.outputTable.style.fontSize = "0.85em";
		this.outputTable.innerHTML = `
            <thead>
                <tr>
                    <th style="width: 20%">${this.i18n.t("analysis_eval")}</th>
                    <th style="width: 15%">${this.i18n.t("analysis_depth")}</th>
                    <th>${this.i18n.t("analysis_line")}</th>
                </tr>
            </thead>
            <tbody id="analysis-lines"></tbody>
        `;
		this.container.appendChild(this.outputTable);
		this.tbody = this.outputTable.querySelector("tbody");
	}

	setDepth(depth) {
		this.props.depth = depth;
	}

	setShowArrows(enabled) {
		this.showArrows = !!enabled;
		const toggleInput = document.getElementById("toggle-analysis-arrows");
		if (toggleInput) {
			toggleInput.checked = this.showArrows;
		}
		if (!this.showArrows) {
			this.clearAnalysisArrows();
		} else {
			this.drawAnalysisArrows();
		}
	}

	async analyze(fen) {
		this.pendingFen = fen;

		// Ensure runner is initialized
		await this.runner.initialized;
		if (this.pendingFen !== fen) return; // superseded while waiting

		// Hook into worker messages before the first search starts
		if (!this.loggerAttached && this.runner.engineWorker) {
			this.runner.engineWorker.addEventListener("message", this.workerListener);
			this.loggerAttached = true;
		}

		// Clear previous lines and arrows to avoid "ghost lines"
		this.lines = {};
		this.renderLines();
		this.clearAnalysisArrows();
		this.tbody.classList.add("text-muted"); // Indicate thinking

		if (this.searching) {
			// startSearch() runs when the engine answers with "bestmove"
			this.runner.uciCmd("stop");
		} else {
			this.startSearch();
		}
	}

	startSearch() {
		const fen = this.pendingFen;
		this.pendingFen = null;
		this.lastFen = fen;
		this.searching = true;

		// The runner's own bestmove handler calls this; analysis ignores it
		this.runner.moveResponse = () => {};

		this.runner.uciCmd(
			`setoption name Skill Level value ${this.props.skillLevel}`,
		);
		this.runner.uciCmd(`setoption name MultiPV value ${this.props.multiPV}`);
		this.runner.uciCmd(`position fen ${fen}`);
		this.runner.uciCmd(`go depth ${this.props.depth}`);
	}

	clearAnalysisArrows() {
		if (!this.board) return;
		this.board.removeArrows(ARROW_TYPE.danger);
		this.board.removeArrows(ARROW_TYPE.info);
	}

	updateDisplay(infoLine) {
		// Extract MultiPV index
		const multipvMatch = infoLine.match(/multipv (\d+)/);
		const multipv = multipvMatch ? parseInt(multipvMatch[1], 10) : 1;

		// Ignore if multipv is greater than requested (though engine shouldn't send it)
		if (multipv > this.props.multiPV) return;

		// Parse Data
		const data = CustomStockfishRunner.parseInfoLine(infoLine);

		// Perspective Fix: Standardize to White's perspective
		// Stockfish normally returns scores relative to side-to-move
		const turn = new Chess(this.lastFen).turn();
		if (turn === "b" && data.score !== "n/a") {
			data.scoreRaw = -data.scoreRaw;
			if (!data.score.startsWith("M")) {
				const val = -parseFloat(data.score);
				data.score = (val > 0 ? "+" : "") + val.toFixed(2);
			} else {
				const mateIn = parseInt(data.score.substring(1), 10);
				data.score = `M${-mateIn}`;
			}
		}

		this.lines[multipv] = data;

		// Update UI
		this.renderLines();
		this.tbody.classList.remove("text-muted"); // Clear thinking state

		// Draw Arrows for Best Moves
		if (this.showArrows) {
			this.drawAnalysisArrows();
		}
	}

	drawAnalysisArrows() {
		if (!this.board) return;
		this.clearAnalysisArrows();

		// Line 1 (Red)
		if (this.lines[1]) {
			this.drawArrowForPV(this.lines[1], ARROW_TYPE.danger);
		}

		// Line 2 (Blue/Primary)
		if (this.lines[2]) {
			this.drawArrowForPV(this.lines[2], ARROW_TYPE.info);
		}
	}

	drawArrowForPV(data, type) {
		if (data.pvArray && data.pvArray.length > 0) {
			const moveStr = data.pvArray[0];
			const from = moveStr.substring(0, 2);
			const to = moveStr.substring(2, 4);
			this.board.addArrow(type, from, to);
		}
	}

	/** @returns {boolean} false when there is no analysis line to show yet */
	hint() {
		if (!this.lines[1]) return false;
		this.drawArrowForPV(this.lines[1], ARROW_TYPE.danger);
		// If showArrows is false, remove after a timeout
		if (!this.showArrows) {
			setTimeout(() => {
				if (!this.showArrows) this.board.removeArrows(ARROW_TYPE.danger);
			}, 3000);
		}
		return true;
	}

	renderLines() {
		this.tbody.innerHTML = "";
		// Sort lines by MultiPV
		Object.keys(this.lines)
			.sort()
			.forEach((key) => {
				const line = this.lines[key];
				const tr = document.createElement("tr");
				tr.innerHTML = `
                <td class="fw-bold">${escapeHtml(line.score)}</td>
                <td>${escapeHtml(line.depth)}</td>
                <td style="word-break: break-word;">${escapeHtml(line.pv)}</td>
            `;
				this.tbody.appendChild(tr);
			});
	}

	destroy() {
		this.runner.uciCmd("stop");
		if (this.runner.engineWorker) {
			this.runner.engineWorker.removeEventListener(
				"message",
				this.workerListener,
			);
			this.runner.engineWorker.terminate();
		}
		this.container.innerHTML = "";
	}
}
