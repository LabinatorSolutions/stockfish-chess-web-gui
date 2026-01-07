import {
  DomUtils
} from "./chunk-TRKBLDR5.js";
import {
  COLOR
} from "./chunk-RHYLFANV.js";
import "./chunk-XZ62UXQF.js";
import {
  Observe
} from "./chunk-5KWTC5XK.js";

// node_modules/chess-console/src/tools/ChessRender.js
var PIECES = {
  notation: {
    de: {
      R: "T",
      N: "S",
      B: "L",
      Q: "D",
      K: "K",
      P: ""
    }
  },
  figures: {
    utf8: {
      Rw: "♖",
      Nw: "♘",
      Bw: "♗",
      Qw: "♕",
      Kw: "♔",
      Pw: "♙",
      Rb: "♜",
      Nb: "♞",
      Bb: "♝",
      Qb: "♛",
      Kb: "♚",
      Pb: "♟"
    },
    fontAwesomePro: {
      Rw: '<i class="far fa-fw fa-chess-rook"></i>',
      Nw: '<i class="far fa-fw fa-chess-knight"></i>',
      Bw: '<i class="far fa-fw fa-chess-bishop"></i>',
      Qw: '<i class="far fa-fw fa-chess-queen"></i>',
      Kw: '<i class="far fa-fw fa-chess-king"></i>',
      Pw: '<i class="far fa-fw fa-chess-pawn"></i>',
      Rb: '<i class="fas fa-fw fa-chess-rook"></i>',
      Nb: '<i class="fas fa-fw fa-chess-knight"></i>',
      Bb: '<i class="fas fa-fw fa-chess-bishop"></i>',
      Qb: '<i class="fas fa-fw fa-chess-queen"></i>',
      Kb: '<i class="fas fa-fw fa-chess-king"></i>',
      Pb: '<i class="fas fa-fw fa-chess-pawn"></i>'
    }
  }
};
var ChessRender = class {
  static san(san, color = COLOR.white, lang = "en", mode = "text", pieces = PIECES.figures.utf8) {
    if (mode === "figures") {
      if (color === COLOR.white) {
        return this.replaceAll(san, {
          "R": pieces.Rw,
          "N": pieces.Nw,
          "B": pieces.Bw,
          "Q": pieces.Qw,
          "K": pieces.Kw
        });
      } else {
        return this.replaceAll(san, {
          "R": pieces.Rb,
          "N": pieces.Nb,
          "B": pieces.Bb,
          "Q": pieces.Qb,
          "K": pieces.Kb
        });
      }
    } else if (mode === "text") {
      return this.replaceAll(san, PIECES.notation[lang]);
    } else {
      console.error("mode must be 'text' or 'figures'");
    }
  }
  static replaceAll(str, replacementsObj, ignoreCase = false) {
    let retStr = str;
    const flags = ignoreCase ? "gi" : "g";
    for (let needle in replacementsObj) {
      retStr = retStr.replace(new RegExp(needle, flags), replacementsObj[needle]);
    }
    return retStr;
  }
};

// node_modules/chess-console/src/components/History.js
var History = class {
  constructor(chessConsole, props) {
    this.context = chessConsole.componentContainers.left.querySelector(".chess-console-history");
    this.chessConsole = chessConsole;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "history");
    this.context.appendChild(this.element);
    this.props = {
      notationType: "figures",
      makeClickable: true
    };
    Object.assign(this.props, props);
    this.chessConsole.state.observeChess(() => {
      this.redraw();
    });
    Observe.property(chessConsole.state, "plyViewed", () => {
      this.redraw();
    });
    if (this.props.makeClickable) {
      this.addClickEvents();
    }
    this.i18n = chessConsole.i18n;
    this.i18n.load({
      "de": {
        "game_history": "Spielnotation"
      },
      "en": {
        "game_history": "Game notation"
      }
    }).then(() => {
      this.redraw();
    });
  }
  addClickEvents() {
    this.clickHandler = DomUtils.delegate(this.element, "click", ".ply", (event) => {
      const ply = parseInt(event.target.getAttribute("data-ply"), 10);
      if (ply <= this.chessConsole.state.chess.history().length) {
        this.chessConsole.state.plyViewed = ply;
      }
    });
    this.element.classList.add("clickable");
  }
  removeClickEvents() {
    this.clickHandler.remove();
    this.element.classList.remove("clickable");
  }
  redraw() {
    window.clearTimeout(this.redrawDebounce);
    this.redrawDebounce = setTimeout(() => {
      const history = this.chessConsole.state.chess.history();
      let sanWhite;
      let sanBlack;
      let output = "";
      let i;
      let rowClass = "";
      let whiteClass = "";
      let blackClass = "";
      for (i = 0; i < history.length; i += 2) {
        const moveWhite = history[i];
        if (moveWhite) {
          sanWhite = ChessRender.san(moveWhite.san, COLOR.white, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
        }
        const moveBlack = history[i + 1];
        if (moveBlack) {
          sanBlack = ChessRender.san(moveBlack.san, COLOR.black, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
        } else {
          sanBlack = "";
        }
        if (this.chessConsole.state.plyViewed < i + 1) {
          whiteClass = "text-muted";
        }
        if (this.chessConsole.state.plyViewed === i + 1) {
          whiteClass = "active";
        }
        if (this.chessConsole.state.plyViewed < i + 2) {
          blackClass = "text-muted";
        }
        if (this.chessConsole.state.plyViewed === i + 2) {
          blackClass = "active";
        }
        output += "<tr><td class='num " + rowClass + "'>" + (i / 2 + 1) + ".</td><td data-ply='" + (i + 1) + "' class='ply " + whiteClass + " ply" + (i + 1) + "'>" + sanWhite + "</td><td data-ply='" + (i + 2) + "' class='ply " + blackClass + " ply" + (i + 2) + "'>" + sanBlack + "</td></tr>";
      }
      this.element.innerHTML = "<h2 class='visually-hidden'>" + this.i18n.t("game_history") + "</h2><table>" + output + "</table>";
      if (this.chessConsole.state.plyViewed > 0) {
        const $ply = $(this.element).find(".ply" + this.chessConsole.state.plyViewed);
        if ($ply.position()) {
          this.element.scrollTop = 0;
          this.element.scrollTop = $ply.position().top - 68;
        }
      }
    });
  }
};
export {
  History
};
//# sourceMappingURL=chess-console_src_components_History__js.js.map
