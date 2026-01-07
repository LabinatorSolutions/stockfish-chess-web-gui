/**
 * Component for handling separate Stockfish analysis.
 */
import { CustomStockfishRunner } from "./CustomStockfishRunner.js"
import { ENGINE_CONFIG } from "./Config.js"
import { ARROW_TYPE } from "cm-chessboard/src/extensions/arrows/Arrows.js"

export class StockfishAnalysis {
	constructor(container, props = {}) {
		this.container = container
		this.board = props.board // New: Accept board instance
		this.props = {
			worker: ENGINE_CONFIG.WORKER_PATH,
			depth: ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH,
			skillLevel: ENGINE_CONFIG.ANALYSIS_SKILL_LEVEL,
			multiPV: 1, // Default to 1 line
			...props
		}
		this.runner = new CustomStockfishRunner({
			workerUrl: this.props.worker,
			debug: false
		})
		this.lines = {}

		// i18n support
		this.i18n = props.i18n || { t: (key) => key } // Fallback if no i18n provided

		this.runner.initialization.then(() => {
			console.log("Analysis Engine Initialized")
		})

		// Create UI elements
		this.renderUI()
	}

	renderUI() {
		this.container.innerHTML = "" // Clear container

		// Control Bar
		const controls = document.createElement("div")
		controls.className = "d-flex justify-content-between align-items-center mb-2"

		const title = document.createElement("strong")
		title.innerText = "Analysis" // Hardcode since it's universally understood
		controls.appendChild(title)

		// Lines Selector
		const linesSelector = document.createElement("select")
		linesSelector.className = "form-select form-select-sm"
		linesSelector.style.width = "auto"
		linesSelector.innerHTML = `
            <option value="1">1 Line</option>
            <option value="2">2 Lines</option>
            <option value="3">3 Lines</option>
        `
		linesSelector.value = this.props.multiPV
		linesSelector.addEventListener("change", (e) => {
			this.props.multiPV = parseInt(e.target.value)
			// Clear current lines to avoid stale data display
			this.lines = {}
			this.renderLines()
			if (this.lastFen) {
				// Restart analysis with new settings
				this.analyze(this.lastFen)
			}
		})
		controls.appendChild(linesSelector)

		this.container.appendChild(controls)

		// Output Area (Table)
		this.outputTable = document.createElement("table")
		this.outputTable.className = "table table-sm table-light table-striped mt-1"
		this.outputTable.style.fontSize = "0.85em"
		this.outputTable.innerHTML = `
            <thead>
                <tr>
                    <th style="width: 20%">Eval</th>
                    <th style="width: 15%">D</th>
                    <th>Line</th>
                </tr>
            </thead>
            <tbody id="analysis-lines"></tbody>
        `
		this.container.appendChild(this.outputTable)
		this.tbody = this.outputTable.querySelector("tbody")
	}

	setDepth(depth) {
		this.props.depth = depth
	}

	async analyze(fen) {
		this.lastFen = fen

		// Ensure runner is initialized
		await this.runner.initialization

		// Define a dummy moveResponse
		this.runner.moveResponse = () => { }

		// Send UCI commands
		this.runner.uciCmd(`stop`) // Stop previous analysis first
		this.runner.uciCmd(`setoption name Skill Level value ${this.props.skillLevel}`)
		this.runner.uciCmd(`setoption name MultiPV value ${this.props.multiPV}`)
		this.runner.uciCmd(`position fen ${fen}`)
		this.runner.uciCmd(`go depth ${this.props.depth}`)

		// Hook into worker messages
		if (!this.loggerAttached && this.runner.engineWorker) {
			this.runner.engineWorker.addEventListener("message", (e) => {
				const line = e.data
				if (line.startsWith("info") && line.includes("pv")) {
					this.updateDisplay(line)
				}
			})
			this.loggerAttached = true
		}
	}

	updateDisplay(infoLine) {
		// Extract MultiPV index
		const multipvMatch = infoLine.match(/multipv (\d+)/)
		const multipv = multipvMatch ? parseInt(multipvMatch[1]) : 1

		// Ignore if multipv is greater than requested (though engine shouldn't send it)
		if (multipv > this.props.multiPV) return

		// Parse Data
		const data = this.parseInfoLine(infoLine)
		this.lines[multipv] = data

		// Update UI
		this.renderLines()

		// Draw Arrow for Best Move (MultiPV 1)
		if (multipv === 1 && this.board && data.pvArray && data.pvArray.length > 0) {
			// Need 'from' and 'to' from the first move string (e.g., e2e4)
			const moveStr = data.pvArray[0]
			const from = moveStr.substring(0, 2)
			const to = moveStr.substring(2, 4)

			// Clear previous arrows of this type first? 
			// Ideally we want to clear arrows ONLY when the best move changes or on new FEN. 
			// But we don't track FEN change here explicitly.
			// Let's rely on simply overwriting a specific arrow type?
			// "RightClickAnnotator" manages arrows. 
			// We can use the board's standard `addArrow` if extensions are loaded.

			// We'll use a specific arrow type for suggestion, e.g., 'primary' or custom.
			// Let's just use the default arrow for now.

			// NOTE: To avoid flickering, we should clear only when moving to a new position.
			// But here we are just updating the same position analysis.
			// We can clear all arrows? No, that clears user annotations.
			// We need a specific arrow set for the engine.
			// For now, let's just add it. Assuming we can manage it later.
			// Actually, `cm-chessboard` arrows are persistent until removed.

			// For simplicity in this iteration:
			// Remove ALL 'analysis' arrows (we need to know which ones)
			// But we don't have a custom type easily without registering it.
			// Let's use ARROW_TYPE.warming for "Analysis"? Or just rely on re-adding?

			// BETTER: We should clear engine arrows before adding new ones.
			// But we can't distinguish easily without a custom type.
			// Let's try to grab the Arrows extension and removeByType if possible.
			// But standard API is removeArrows(type).

			// Let's assume we can use `ARROW_TYPE.danger` (Red) for engine best move.
			this.board.removeArrows(ARROW_TYPE.danger)
			this.board.addArrow(ARROW_TYPE.danger, from, to)
		}
	}

	renderLines() {
		this.tbody.innerHTML = ""
		// Sort lines by MultiPV
		Object.keys(this.lines).sort().forEach(key => {
			const line = this.lines[key]
			const tr = document.createElement("tr")

			// Score Formatting
			let scoreClass = "text-dark"
			tr.innerHTML = `
                <td class="${scoreClass} font-weight-bold">${line.score}</td>
                <td>${line.depth}</td>
                <td class="text-dark" style="word-break: break-word;">${line.pv}</td>
            `
			this.tbody.appendChild(tr)
		})
	}

	parseInfoLine(line) {
		// Extract Score
		let score = "n/a"
		let scoreRaw = 0
		if (line.includes("score cp")) {
			const match = line.match(/score cp (-?\d+)/)
			if (match) {
				scoreRaw = parseInt(match[1])
				score = (scoreRaw / 100).toFixed(2)
				if (scoreRaw > 0) score = "+" + score
			}
		} else if (line.includes("score mate")) {
			const match = line.match(/score mate (-?\d+)/)
			if (match) {
				scoreRaw = parseInt(match[1]) * 10000 // Huge value
				score = `M${match[1]}`
			}
		}

		// Extract Depth
		const depthMatch = line.match(/depth (\d+)/)
		const depth = depthMatch ? depthMatch[1] : "?"

		// Extract PV
		const pvIndex = line.indexOf(" pv ")
		const pvRaw = pvIndex !== -1 ? line.substring(pvIndex + 4) : ""
		// Truncate PV for display
		const pvArray = pvRaw.split(" ")
		const pvtruncated = pvArray.slice(0, 5).join(" ")

		return {
			score,
			scoreRaw,
			depth,
			pv: pvtruncated,
			pvArray
		}
	}
}
