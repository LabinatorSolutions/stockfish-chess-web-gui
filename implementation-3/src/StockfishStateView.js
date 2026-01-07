/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/chess-console-stockfish
 * License: MIT, see file 'LICENSE'
 */
import { Observe } from "cm-web-modules/src/observe/Observe.js"
import { UiComponent } from "cm-web-modules/src/app/Component.js"
import { ENGINE_STATE } from "cm-engine-runner/src/EngineRunner.js"

export class StockfishStateView extends UiComponent {

    /**
     * @param chessConsole
     * @param player
     * @param props // { spinnerIcon: spinner }
     */
    constructor(chessConsole, player, props = {}) {
        super(undefined, props)
        this.chessConsole = chessConsole
        this.player = player
        const i18n = chessConsole.i18n
        if (!this.props.spinnerIcon) {
            this.props.spinnerIcon = "spinner"
        }
        this.numberFormat = new Intl.NumberFormat(i18n.locale, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        })
        this.element = this.chessConsole.context.querySelector(".engine-state")

        // Premium Bootstrap-based structure
        this.element.innerHTML = `
            <div class="card border-0 shadow-sm bg-light overflow-hidden">
                <div class="card-body p-2 d-flex align-items-center gap-3">
                    <div class="flex-shrink-0 d-flex align-items-center">
                        <div class="engine-status-indicator pulse-animation-ready rounded-circle" 
                             style="width: 12px; height: 12px; background-color: var(--bs-success);"></div>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted fw-bold text-uppercase engine-name-label" style="font-size: 0.65rem;">Engine Status</small>
                            <span class="badge score-badge bg-secondary" style="font-size: 0.75rem;">Score: 0.0</span>
                        </div>
                        <div class="progress" style="height: 6px; background-color: rgba(0,0,0,0.05);">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                 role="progressbar" style="width: 0%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 status-label-container">
                        <span class="badge status-badge rounded-pill bg-white text-dark border fw-medium" 
                              style="font-size: 0.7rem; min-width: 70px;">Ready</span>
                    </div>
                </div>
            </div>
        `

        this.statusIndicator = this.element.querySelector(".engine-status-indicator")
        this.scoreBadge = this.element.querySelector(".score-badge")
        this.progressBar = this.element.querySelector(".progress-bar")
        this.statusBadge = this.element.querySelector(".status-badge")
        this.nameLabel = this.element.querySelector(".engine-name-label")

        Observe.property(player.state, "skillLevel", () => {
            this.updatePlayerName()
        })
        Observe.property(player.state, "depth", () => {
            this.updatePlayerName()
        })
        Observe.property(player.state, "engineState", () => {
            const state = player.state.engineState
            if (state === ENGINE_STATE.THINKING) {
                this.statusIndicator.style.backgroundColor = 'var(--bs-primary)'
                this.statusIndicator.classList.add('pulse-animation-thinking')
                this.statusIndicator.classList.remove('pulse-animation-ready')
                this.progressBar.style.width = '100%'
                this.statusBadge.innerText = 'Thinking'
                this.statusBadge.classList.remove('bg-white', 'text-dark')
                this.statusBadge.classList.add('bg-primary', 'text-white')
            } else if (state === ENGINE_STATE.LOADING) {
                this.statusIndicator.style.backgroundColor = 'var(--bs-warning)'
                this.progressBar.style.width = '30%'
                this.statusBadge.innerText = 'Loading'
            } else {
                this.statusIndicator.style.backgroundColor = 'var(--bs-success)'
                this.statusIndicator.classList.add('pulse-animation-ready')
                this.statusIndicator.classList.remove('pulse-animation-thinking')
                this.progressBar.style.width = '0%'
                this.statusBadge.innerText = 'Ready'
                this.statusBadge.classList.add('bg-white', 'text-dark')
                this.statusBadge.classList.remove('bg-primary', 'text-white')
            }
        })
        Observe.property(player.state, "score", (event) => {
            this.updateScoreDisplay(event.newValue)
        })
        Observe.property(this.chessConsole.state, "plyViewed", () => {
            let score = player.state.scoreHistory[this.chessConsole.state.plyViewed]
            if (!score && this.chessConsole.state.plyViewed > 0) {
                score = player.state.scoreHistory[this.chessConsole.state.plyViewed - 1]
            }
            this.updateScoreDisplay(score)
        })
        this.updatePlayerName()
    }

    updateScoreDisplay(score) {
        if (score !== undefined && score !== null) {
            let scoreFormatted
            if (isNaN(score)) {
                scoreFormatted = score
            } else {
                scoreFormatted = (score > 0 ? "+" : "") + this.numberFormat.format(score)
            }
            this.scoreBadge.innerHTML = `Score: ${scoreFormatted}`

            // Determine color based on score
            if (!isNaN(score)) {
                if (score > 1) {
                    this.scoreBadge.className = 'badge score-badge bg-success'
                } else if (score < -1) {
                    this.scoreBadge.className = 'badge score-badge bg-danger'
                } else {
                    this.scoreBadge.className = 'badge score-badge bg-secondary'
                }
            } else {
                this.scoreBadge.className = 'badge score-badge bg-secondary'
            }
        } else {
            this.scoreBadge.innerHTML = `Score: 0.0`
            this.scoreBadge.className = 'badge score-badge bg-secondary'
        }
    }

    updatePlayerName() {
        this.player.name = `Stockfish (${this.chessConsole.i18n.t("skillLevel")} ${this.player.state.skillLevel}, ${this.chessConsole.i18n.t("depth")} ${this.player.state.depth})`
    }
}
