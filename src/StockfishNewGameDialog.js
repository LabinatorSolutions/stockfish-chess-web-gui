import { bootstrap } from "./bootstrap-global.js";
import { ENGINE_CONFIG, STYLING_CONFIG } from "./Config.js";
import { escapeHtml } from "./Utils.js";

export class StockfishNewGameDialog {
	constructor(chessConsole, props) {
		this.chessConsole = chessConsole;
		this.props = props;
		const i18n = chessConsole.i18n;
		i18n
			.load({
				en: {
					color: "Color",
					white: "White",
					black: "Black",
					skillLevel: "Skill Level",
					depth: "Fixed Depth",
					elo: "Elo Rating",
					moveTime: "Thinking Time",
					searchMode: "Search Mode",
					modeSkill: "By Skill Level",
					modeElo: "By Elo Rating",
					modeDepth: "By Fixed Depth",
					modeTime: "By Thinking Time",
					gameMode: "Game Mode",
					pve: "vs. Stockfish (Engine)",
					pvp: "Local PvP (Pass-and-Play)",
					analysis: "Analysis Mode",
					styling: "Styling",
					gameSettings: "Game Settings",
					boardTheme: "Board Theme",
					pieceSet: "Piece Set",
					"theme_black-stone": "Black Stone",
					"theme_blue-sky": "Blue Sky",
					"theme_brown-wood": "Brown Wood",
					"theme_bw-paper": "B&W Paper",
					"theme_gray-iron": "Gray Iron",
					"theme_green-forest": "Green Forest",
					"theme_navy-ocean": "Navy Ocean",
					"theme_pink-bubblegum": "Pink Bubblegum",
					"theme_purple-mist": "Purple Mist",
					"theme_red-wine": "Red Wine",
					"theme_teal-pond": "Teal Pond",
					"theme_yellow-sand": "Yellow Sand",
					pieces_standard: "Standard",
					pieces_staunty: "Staunty",
					engineSettings: "Engine search settings",
					analysisSettings: "Analysis settings",
					analysisDepthLabel: "Analysis Engine Depth",
				},
			})
			.then(() => {
				const newGameColor =
					chessConsole.persistence.loadValue("newGameColor") || "w";
				const savedSkillLevel =
					chessConsole.persistence.loadValue("skillLevel") ||
					ENGINE_CONFIG.DEFAULT_SKILL_LEVEL;
				const savedDepth =
					chessConsole.persistence.loadValue("depth") ||
					ENGINE_CONFIG.DEFAULT_DEPTH;

				const savedAnalysisDepth =
					chessConsole.persistence.loadValue("analysisDepth") ||
					ENGINE_CONFIG.DEFAULT_ANALYSIS_DEPTH;
				const savedMode =
					chessConsole.persistence.loadValue("gameMode") || "pve";
				const savedElo =
					chessConsole.persistence.loadValue("elo") ||
					ENGINE_CONFIG.DEFAULT_ELO;
				const savedMoveTime =
					chessConsole.persistence.loadValue("moveTime") ||
					ENGINE_CONFIG.DEFAULT_MOVE_TIME;
				const savedSearchMode =
					chessConsole.persistence.loadValue("searchMode") || "skill";
				const savedTheme =
					chessConsole.persistence.loadValue("boardTheme") ||
					STYLING_CONFIG.DEFAULT_THEME;
				const savedPieceSet =
					chessConsole.persistence.loadValue("pieceSet") ||
					STYLING_CONFIG.DEFAULT_PIECES;

				props.modalClass = "fade";
				props.body = `<div class="form">
                        <ul class="nav nav-tabs mb-3" id="dialogTabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="game-tab" data-bs-toggle="tab" data-bs-target="#game-pane" type="button" role="tab">${i18n.t("gameSettings")}</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="styling-tab" data-bs-toggle="tab" data-bs-target="#styling-pane" type="button" role="tab">${i18n.t("styling")}</button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <!-- Game Settings Tab -->
                            <div class="tab-pane fade show active" id="game-pane" role="tabpanel">
                                <div class="row mb-3">
                                    <label for="gameMode" class="col-sm-4 col-form-label">${i18n.t("gameMode")}</label>
                                    <div class="col-sm-8">
                                        <select id="gameMode" class="form-select">
                                            <option value="pve" ${savedMode === "pve" ? "selected" : ""}>${i18n.t("pve")}</option>
                                            <option value="pvp" ${savedMode === "pvp" ? "selected" : ""}>${i18n.t("pvp")}</option>
                                            <option value="analysis" ${savedMode === "analysis" ? "selected" : ""}>${i18n.t("analysis")}</option>
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
                                <hr>
                                <h6>${i18n.t("engineSettings")}</h6>
                                <div class="row mb-3" id="searchModeRow">
                                    <label for="searchMode" class="col-sm-4 col-form-label">${i18n.t("searchMode")}</label>
                                    <div class="col-sm-8">
                                        <select class="form-select" id="searchMode">
                                            <option value="skill" ${savedSearchMode === "skill" ? "selected" : ""}>${i18n.t("modeSkill")}</option>
                                            <option value="elo" ${savedSearchMode === "elo" ? "selected" : ""}>${i18n.t("modeElo")}</option>
                                            <option value="depth" ${savedSearchMode === "depth" ? "selected" : ""}>${i18n.t("modeDepth")}</option>
                                            <option value="time" ${savedSearchMode === "time" ? "selected" : ""}>${i18n.t("modeTime")}</option>
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
                                <div class="row mb-3" id="eloRow">
                                    <label for="elo" class="col-sm-4 col-form-label">${i18n.t("elo")} (${ENGINE_CONFIG.MIN_ELO}-${ENGINE_CONFIG.MAX_ELO})</label>
                                    <div class="col-sm-8">
                                        <input type="range" class="form-range" id="elo" min="${ENGINE_CONFIG.MIN_ELO}" max="${ENGINE_CONFIG.MAX_ELO}" value="${savedElo}">
                                        <div class="text-muted small">Value: <span id="eloValue">${savedElo}</span></div>
                                    </div>
                                </div>
                                <div class="row mb-3" id="depthRow">
                                    <label for="depth" class="col-sm-4 col-form-label">${i18n.t("depth")} (${ENGINE_CONFIG.MIN_DEPTH}-${ENGINE_CONFIG.MAX_DEPTH})</label>
                                    <div class="col-sm-8">
                                        <input type="range" class="form-range" id="depth" min="${ENGINE_CONFIG.MIN_DEPTH}" max="${ENGINE_CONFIG.MAX_DEPTH}" value="${savedDepth}">
                                        <div class="text-muted small">Value: <span id="depthValue">${savedDepth}</span></div>
                                    </div>
                                </div>
                                <div class="row mb-3" id="moveTimeRow">
                                    <label for="moveTime" class="col-sm-4 col-form-label">${i18n.t("moveTime")} (${ENGINE_CONFIG.MIN_MOVE_TIME}-${ENGINE_CONFIG.MAX_MOVE_TIME}ms)</label>
                                    <div class="col-sm-8">
                                        <input type="range" class="form-range" id="moveTime" min="${ENGINE_CONFIG.MIN_MOVE_TIME}" max="${ENGINE_CONFIG.MAX_MOVE_TIME}" step="100" value="${savedMoveTime}">
                                        <div class="text-muted small">Value: <span id="moveTimeValue">${savedMoveTime}</span>ms</div>
                                    </div>
                                </div>
                                <hr>
                                <h6>${i18n.t("analysisSettings")}</h6>
                                <div class="row mb-3">
                                    <label for="analysisDepth" class="col-sm-4 col-form-label">${i18n.t("analysisDepthLabel")} (${ENGINE_CONFIG.MIN_ANALYSIS_DEPTH}-${ENGINE_CONFIG.MAX_ANALYSIS_DEPTH})</label>
                                    <div class="col-sm-8">
                                        <input type="range" class="form-range" id="analysisDepth" min="${ENGINE_CONFIG.MIN_ANALYSIS_DEPTH}" max="${ENGINE_CONFIG.MAX_ANALYSIS_DEPTH}" value="${savedAnalysisDepth}">
                                        <div class="text-muted small">Value: <span id="analysisDepthValue">${savedAnalysisDepth}</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- Styling Tab -->
                            <div class="tab-pane fade" id="styling-pane" role="tabpanel">
                                <div class="row mb-3">
                                    <label for="boardTheme" class="col-sm-4 col-form-label">${i18n.t("boardTheme")}</label>
                                    <div class="col-sm-8">
                                        <select id="boardTheme" class="form-select">
                                            ${STYLING_CONFIG.THEMES.map((t) => `<option value="${t.id}" ${savedTheme === t.id ? "selected" : ""}>${i18n.t(`theme_${t.id}`)}</option>`).join("")}
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="pieceSet" class="col-sm-4 col-form-label">${i18n.t("pieceSet")}</label>
                                    <div class="col-sm-8">
                                        <select id="pieceSet" class="form-select">
                                            ${STYLING_CONFIG.PIECE_SETS.map((p) => `<option value="${p.id}" ${savedPieceSet === p.id ? "selected" : ""}>${i18n.t(`pieces_${p.id}`)}</option>`).join("")}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
				props.footer = `<button type="button" class="btn btn-link" data-bs-dismiss="modal">${i18n.t("cancel")}</button>
            <button type="submit" class="btn btn-primary">${i18n.t("ok")}</button>`;
				props.onCreate = (modal) => {
					const form = modal.element.querySelector(".form");
					const gameModeEl = form.querySelector("#gameMode");
					const searchModeEl = form.querySelector("#searchMode");
					const skillLevelInput = form.querySelector("#skillLevel");
					const skillLevelValue = form.querySelector("#skillLevelValue");
					const depthInput = form.querySelector("#depth");
					const depthValue = form.querySelector("#depthValue");
					const eloInput = form.querySelector("#elo");
					const eloValue = form.querySelector("#eloValue");
					const moveTimeInput = form.querySelector("#moveTime");
					const moveTimeValue = form.querySelector("#moveTimeValue");
					const analysisDepthInput = form.querySelector("#analysisDepth");
					const analysisDepthValue = form.querySelector("#analysisDepthValue");

					const searchModeRow = form.querySelector("#searchModeRow");
					const skillLevelRow = form.querySelector("#skillLevelRow");
					const depthRow = form.querySelector("#depthRow");
					const eloRow = form.querySelector("#eloRow");
					const moveTimeRow = form.querySelector("#moveTimeRow");
					const colorRow = form.querySelector("#colorRow");

					const setRowVisible = (row, visible) => {
						row.style.display = visible ? "" : "none";
					};

					const updateVisibility = () => {
						const gameMode = gameModeEl.value;
						if (gameMode === "analysis" || gameMode === "pvp") {
							setRowVisible(colorRow, false);
							setRowVisible(searchModeRow, false);
							setRowVisible(skillLevelRow, false);
							setRowVisible(depthRow, false);
							setRowVisible(eloRow, false);
							setRowVisible(moveTimeRow, false);
						} else {
							setRowVisible(colorRow, true);
							setRowVisible(searchModeRow, true);
							const searchModeValue = searchModeEl.value;
							setRowVisible(skillLevelRow, searchModeValue === "skill");
							setRowVisible(eloRow, searchModeValue === "elo");
							setRowVisible(depthRow, searchModeValue === "depth");
							setRowVisible(moveTimeRow, searchModeValue === "time");
						}
					};
					gameModeEl.addEventListener("change", updateVisibility);
					searchModeEl.addEventListener("change", updateVisibility);
					updateVisibility();

					skillLevelInput.addEventListener("input", () => {
						skillLevelValue.textContent = skillLevelInput.value;
					});
					depthInput.addEventListener("input", () => {
						depthValue.textContent = depthInput.value;
					});
					eloInput.addEventListener("input", () => {
						eloValue.textContent = eloInput.value;
					});
					moveTimeInput.addEventListener("input", () => {
						moveTimeValue.textContent = moveTimeInput.value;
					});
					analysisDepthInput.addEventListener("input", () => {
						analysisDepthValue.textContent = analysisDepthInput.value;
					});

					modal.element.addEventListener("click", (event) => {
						const submitBtn = event.target.closest("button[type='submit']");
						if (!submitBtn || !modal.element.contains(submitBtn)) return;
						event.preventDefault();
						const color = form.querySelector("#color").value;
						chessConsole.persistence.saveValue("newGameColor", color);
						const skillLevel = parseInt(skillLevelInput.value, 10);
						const depth = parseInt(depthInput.value, 10);
						const elo = parseInt(eloInput.value, 10);
						const moveTime = parseInt(moveTimeInput.value, 10);
						const analysisDepth = parseInt(analysisDepthInput.value, 10);
						const gameMode = gameModeEl.value;
						const searchMode = searchModeEl.value;
						const boardTheme = form.querySelector("#boardTheme").value;
						const pieceSet = form.querySelector("#pieceSet").value;

						chessConsole.persistence.saveValue("elo", elo);
						chessConsole.persistence.saveValue("moveTime", moveTime);
						chessConsole.persistence.saveValue("gameMode", gameMode);
						chessConsole.persistence.saveValue("analysisDepth", analysisDepth);
						chessConsole.persistence.saveValue("searchMode", searchMode);
						chessConsole.persistence.saveValue("boardTheme", boardTheme);
						chessConsole.persistence.saveValue("pieceSet", pieceSet);

						modal.hide();
						chessConsole.newGame({
							playerColor: color,
							engineSkillLevel: skillLevel,
							engineDepth: depth,
							engineElo: elo,
							engineMoveTime: moveTime,
							engineSearchMode: searchMode,
							analysisDepth: analysisDepth,
							gameMode: gameMode,
							boardTheme: boardTheme,
							pieceSet: pieceSet,
						});
					});
				};
				const modalId = "new-game-modal";
				let modalElement = document.getElementById(modalId);
				if (!modalElement) {
					modalElement = document.createElement("div");
					modalElement.id = modalId;
					modalElement.className = "modal fade";
					modalElement.setAttribute("tabindex", "-1");
					modalElement.setAttribute("aria-hidden", "true");
					document.body.appendChild(modalElement);
				}

				modalElement.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${escapeHtml(props.title || "New Game")}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">${props.body}</div>
                        <div class="modal-footer">${props.footer}</div>
                    </div>
                </div>
            `;

				const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

				if (props.onCreate) {
					props.onCreate({
						element: modalElement,
						hide: () => modal.hide(),
					});
				}

				modal.show();

				modalElement.addEventListener(
					"hidden.bs.modal",
					() => {
						// Focus the board or something to avoid aria-hidden issues on the triggering button
						if (chessConsole.components?.board?.elements?.chessboard) {
							chessConsole.components.board.elements.chessboard.focus();
						}
					},
					{ once: true },
				);
			});
	}
}
