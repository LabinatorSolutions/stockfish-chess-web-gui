// node_modules/chess-console/src/components/GameStateOutput.js
var GameStateOutput = class {
  constructor(chessConsole) {
    this.context = chessConsole.componentContainers.notifications;
    this.chessConsole = chessConsole;
    this.i18n = chessConsole.i18n;
    this.i18n.load(
      {
        de: {
          game_over: "Das Spiel ist beendet",
          check: "Schach!",
          checkmate: "Schachmatt",
          draw: "Remis",
          stalemate: "Patt",
          threefold_repetition: "Remis durch dreifache Wiederholung"
        },
        en: {
          game_over: "The game is over",
          check: "Check!",
          checkmate: "Checkmate",
          draw: "Draw",
          stalemate: "Stalemate",
          threefold_repetition: "Draw by threefold repetition"
        }
      }
    );
    this.element = document.createElement("div");
    this.element.setAttribute("class", "gameState alert alert-primary mb-2");
    this.context.appendChild(this.element);
    this.chessConsole.state.observeChess(() => {
      this.redraw();
    });
    this.redraw();
  }
  redraw() {
    const chess = this.chessConsole.state.chess;
    let html = "";
    if (chess.gameOver()) {
      html += `<b>${this.i18n.t("game_over")}</b><br/>`;
      if (chess.inCheckmate()) {
        html += `${this.i18n.t("checkmate")}`;
      } else if (chess.inStalemate()) {
        html += `${this.i18n.t("stalemate")}`;
      } else if (chess.inThreefoldRepetition()) {
        html += `${this.i18n.t("threefold_repetition")}`;
      } else if (chess.inDraw()) {
        html += `${this.i18n.t("draw")}`;
      }
    } else if (chess.inCheck()) {
      html = `${this.i18n.t("check")}`;
    } else {
      html = "";
    }
    if (html) {
      this.chessConsole.componentContainers.notifications.style.display = "block";
      this.element.innerHTML = `${html}`;
    } else {
      this.chessConsole.componentContainers.notifications.style.display = "none";
    }
  }
};
export {
  GameStateOutput
};
//# sourceMappingURL=chess-console_src_components_GameStateOutput__js.js.map
