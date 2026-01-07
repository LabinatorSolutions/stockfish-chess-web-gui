import { ENGINE_CONFIG } from "./Config.js"

export class StockfishNewGameDialog {

    constructor(chessConsole, props) {
        this.chessConsole = chessConsole
        this.props = props
        const i18n = chessConsole.i18n
        i18n.load({
            en: {
                color: "Color",
                white: "White",
                black: "Black",
                skillLevel: "Playing Engine Skill Level",
                depth: "Playing Engine Depth"
            }
        }).then(() => {
            const newGameColor = chessConsole.persistence.loadValue("newGameColor") || "w"
            const savedSkillLevel = chessConsole.persistence.loadValue("skillLevel") || ENGINE_CONFIG.DEFAULT_SKILL_LEVEL
            const savedDepth = chessConsole.persistence.loadValue("depth") || ENGINE_CONFIG.DEFAULT_DEPTH

            const savedAnalysisDepth = chessConsole.persistence.loadValue("analysisDepth") || ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH
            const savedMode = chessConsole.persistence.loadValue("gameMode") || "pve"

            props.modalClass = "fade"
            props.body = `<div class="form">
                        <div class="row mb-3">
                            <label for="gameMode" class="col-sm-4 col-form-label">Mode</label>
                            <div class="col-sm-8">
                                <select id="gameMode" class="form-select">
                                    <option value="pve" ${savedMode === "pve" ? "selected" : ""}>Play vs Engine</option>
                                    <option value="analysis" ${savedMode === "analysis" ? "selected" : ""}>Analysis Board</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3" id="colorRow">
                            <label for="color" class="col-sm-4 col-form-label">${i18n.t("color")}</label>
                            <div class="col-sm-8">
                                <select id="color" class="form-select">
                                    <option value="w" ${newGameColor === "w" ? "selected" : ""}>${i18n.t("white")}</option>
                                    <option value="b" ${newGameColor === "b" ? "selected" : ""}>${i18n.t("black")}</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3" id="skillLevelRow">
                            <label for="skillLevel" class="col-sm-4 col-form-label">${i18n.t("skillLevel")} (${ENGINE_CONFIG.MIN_SKILL_LEVEL}-${ENGINE_CONFIG.MAX_SKILL_LEVEL})</label>
                            <div class="col-sm-8">
                                <input type="range" class="form-range" id="skillLevel" min="${ENGINE_CONFIG.MIN_SKILL_LEVEL}" max="${ENGINE_CONFIG.MAX_SKILL_LEVEL}" value="${savedSkillLevel}">
                                <div class="text-muted small">Value: <span id="skillLevelValue">${savedSkillLevel}</span></div>
                            </div>
                        </div>
                        <div class="row mb-3" id="depthRow">
                            <label for="depth" class="col-sm-4 col-form-label">${i18n.t("depth")} (${ENGINE_CONFIG.MIN_DEPTH}-${ENGINE_CONFIG.MAX_DEPTH})</label>
                            <div class="col-sm-8">
                                <input type="range" class="form-range" id="depth" min="${ENGINE_CONFIG.MIN_DEPTH}" max="${ENGINE_CONFIG.MAX_DEPTH}" value="${savedDepth}">
                                <div class="text-muted small">Value: <span id="depthValue">${savedDepth}</span></div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="analysisDepth" class="col-sm-4 col-form-label">Analysis Engine Depth (${ENGINE_CONFIG.MIN_ANALYSIS_DEPTH}-${ENGINE_CONFIG.MAX_ANALYSIS_DEPTH})</label>
                            <div class="col-sm-8">
                                <input type="range" class="form-range" id="analysisDepth" min="${ENGINE_CONFIG.MIN_ANALYSIS_DEPTH}" max="${ENGINE_CONFIG.MAX_ANALYSIS_DEPTH}" value="${savedAnalysisDepth}">
                                <div class="text-muted small">Value: <span id="analysisDepthValue">${savedAnalysisDepth}</span></div>
                            </div>
                        </div>
                    </div>`
            props.footer = `<button type="button" class="btn btn-link" data-bs-dismiss="modal">${i18n.t("cancel")}</button>
            <button type="submit" class="btn btn-primary">${i18n.t("ok")}</button>`
            props.onCreate = (modal) => {
                const $form = $(modal.element).find(".form")
                const $gameMode = $form.find("#gameMode")
                const $skillLevelInput = $form.find("#skillLevel")
                const $skillLevelValue = $form.find("#skillLevelValue")
                const $depthInput = $form.find("#depth")
                const $depthValue = $form.find("#depthValue")
                const $analysisDepthInput = $form.find("#analysisDepth")
                const $analysisDepthValue = $form.find("#analysisDepthValue")
                const $skillLevelRow = $form.find("#skillLevelRow")
                const $depthRow = $form.find("#depthRow")
                // const $colorRow = $form.find("#colorRow") // Color might be needed in analysis too if user wants to set up board? Usually just white/black. But let's keep it visible.

                const updateVisibility = () => {
                    if ($gameMode.val() === "analysis") {
                        $skillLevelRow.hide()
                        $depthRow.hide()
                    } else {
                        $skillLevelRow.show()
                        $depthRow.show()
                    }
                }
                $gameMode.on("change", updateVisibility)
                updateVisibility()

                $skillLevelInput.on("input", () => {
                    $skillLevelValue.text($skillLevelInput.val())
                })
                $depthInput.on("input", () => {
                    $depthValue.text($depthInput.val())
                })
                $analysisDepthInput.on("input", () => {
                    $analysisDepthValue.text($analysisDepthInput.val())
                })

                $(modal.element).on("click", "button[type='submit']", function (event) {
                    event.preventDefault()
                    let color = $form.find("#color").val()
                    chessConsole.persistence.saveValue("newGameColor", color)
                    const skillLevel = parseInt($skillLevelInput.val(), 10)
                    const depth = parseInt($depthInput.val(), 10)
                    const analysisDepth = parseInt($analysisDepthInput.val(), 10)
                    const gameMode = $gameMode.val()

                    chessConsole.persistence.saveValue("gameMode", gameMode)
                    chessConsole.persistence.saveValue("analysisDepth", analysisDepth)

                    modal.hide()
                    chessConsole.newGame({
                        playerColor: color,
                        engineSkillLevel: skillLevel,
                        engineDepth: depth,
                        analysisDepth: analysisDepth,
                        gameMode: gameMode
                    })
                })
            }
            const modalId = 'new-game-modal'
            let modalElement = document.getElementById(modalId)
            if (!modalElement) {
                modalElement = document.createElement('div')
                modalElement.id = modalId
                modalElement.className = 'modal fade'
                modalElement.setAttribute('tabindex', '-1')
                modalElement.setAttribute('aria-hidden', 'true')
                document.body.appendChild(modalElement)
            }

            modalElement.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${props.title || 'New Game'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">${props.body}</div>
                        <div class="modal-footer">${props.footer}</div>
                    </div>
                </div>
            `

            const modal = bootstrap.Modal.getOrCreateInstance(modalElement)

            if (props.onCreate) {
                props.onCreate({
                    element: modalElement,
                    hide: () => modal.hide()
                })
            }

            modal.show()

            modalElement.addEventListener('hidden.bs.modal', () => {
                // Focus the board or something to avoid aria-hidden issues on the triggering button
                if (chessConsole.components && chessConsole.components.board && chessConsole.components.board.elements && chessConsole.components.board.elements.chessboard) {
                    chessConsole.components.board.elements.chessboard.focus()
                }
            }, { once: true })
        })
    }
}

