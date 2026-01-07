/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/chess-console-stockfish
 * License: MIT, see file 'LICENSE'
 */

import { GameControl } from "chess-console/src/components/GameControl/GameControl.js"
import { StockfishNewGameDialog } from "./StockfishNewGameDialog.js"

export class StockfishGameControl extends GameControl {
    constructor(chessConsole, props) {
        super(chessConsole, props)

        // Wait for i18n load (which base class also does) to ensure we append AFTER base buttons
        this.chessConsole.i18n.load({}).then(() => {
            this.$btnSetup = $('<button type="button" id="btn-setup" class="btn btn-icon btn-primary" title="Setup / Import"><i class="fas fa-paste"></i></button>')
            this.$btnClearAnnotations = $('<button type="button" id="btn-clear-annotations" class="btn btn-icon btn-danger" title="Clear Annotations"><i class="fas fa-eraser"></i></button>')

            this.context.appendChild(this.$btnSetup[0])
            this.context.appendChild(this.$btnClearAnnotations[0])
        })
    }

    showNewGameDialog() {
        new StockfishNewGameDialog(this.chessConsole, {
            title: this.chessConsole.i18n.t('start_game'),
            player: this.props.player
        })
    }
}
