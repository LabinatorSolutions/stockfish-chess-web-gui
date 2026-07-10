// @ts-nocheck -- extends chess-console's GameControl, which ships no type declarations
/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/chess-console-stockfish
 * License: MIT, see file 'LICENSE'
 */

import { GameControl } from "chess-console/src/components/GameControl/GameControl.js";
import { StockfishNewGameDialog } from "./StockfishNewGameDialog.js";

function createElement(html) {
	const template = document.createElement("template");
	template.innerHTML = html.trim();
	return template.content.firstElementChild;
}

export class StockfishGameControl extends GameControl {
	constructor(chessConsole, props) {
		super(chessConsole, props);

		// Wait for i18n load (which base class also does) to ensure we append AFTER base buttons
		this.chessConsole.i18n
			.load({
				en: {
					hint: "Hint",
					swap_sides: "Swap Sides",
					setup_import: "Setup / Import",
					clear_annotations: "Clear Annotations",
				},
			})
			.then(() => {
				this.btnSetup = createElement(
					`<button type="button" id="btn-setup" class="btn btn-icon btn-primary" title="${this.chessConsole.i18n.t("setup_import")}" aria-label="${this.chessConsole.i18n.t("setup_import")}"><i class="fas fa-paste"></i></button>`,
				);
				this.btnClearAnnotations = createElement(
					`<button type="button" id="btn-clear-annotations" class="btn btn-icon btn-danger" title="${this.chessConsole.i18n.t("clear_annotations")}" aria-label="${this.chessConsole.i18n.t("clear_annotations")}"><i class="fas fa-eraser"></i></button>`,
				);
				this.btnHint = createElement(
					`<button type="button" id="btn-hint" class="btn btn-icon btn-warning" title="${this.chessConsole.i18n.t("hint")}" aria-label="${this.chessConsole.i18n.t("hint")}"><i class="fas fa-lightbulb"></i></button>`,
				);
				this.btnSwapSides = createElement(
					`<button type="button" id="btn-swap-sides" class="btn btn-icon btn-secondary" title="${this.chessConsole.i18n.t("swap_sides")}" aria-label="${this.chessConsole.i18n.t("swap_sides")}"><i class="fas fa-retweet"></i></button>`,
				);

				this.context.appendChild(this.btnSetup);
				this.context.appendChild(this.btnClearAnnotations);
				this.context.appendChild(this.btnHint);
				this.context.appendChild(this.btnSwapSides);

				// Replace the "+" icon with a cog (settings) icon
				const icon = this.btnStartNewGame.querySelector("i");
				if (icon) {
					icon.classList.remove("fa-plus");
					icon.classList.add("fa-cog");
				}
			});
	}

	showNewGameDialog() {
		new StockfishNewGameDialog(this.chessConsole, {
			title: this.chessConsole.i18n.t("start_game"),
			player: this.props.player,
		});
	}

	setAnalysis(analysis) {
		this.analysis = analysis;
	}
}
