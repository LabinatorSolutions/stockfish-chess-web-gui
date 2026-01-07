import {
  COLOR
} from "./chunk-22FRA7I2.js";
import "./chunk-2NUPLSFN.js";
import "./chunk-WCRIPQW3.js";
import {
  Observe
} from "./chunk-5KWTC5XK.js";

// node_modules/chess-console/src/components/HistoryControl.js
var HistoryControl = class {
  constructor(chessConsole, props = {}) {
    this.context = chessConsole.componentContainers.controlButtons;
    this.chessConsole = chessConsole;
    const i18n = chessConsole.i18n;
    this.props = {
      autoPlayDelay: 1500
    };
    Object.assign(this.props, props);
    i18n.load({
      de: {
        "to_game_start": "Zum Spielstart",
        "one_move_back": "Ein Zug zurück",
        "one_move_forward": "Ein Zug weiter",
        "to_last_move": "Zum letzen Zug",
        "auto_run": "Automatisch abspielen",
        "turn_board": "Brett drehen"
      },
      en: {
        "to_game_start": "To game start",
        "one_move_back": "One move back",
        "one_move_forward": "One move forward",
        "to_last_move": "To last move",
        "auto_run": "Auto play",
        "turn_board": "Turn board"
      }
    }).then(() => {
      this.$btnFirst = $(`<button type="button" title="${i18n.t("to_game_start")}" class="btn btn-link text-black first"><i class="fa fa-fw fa-fast-backward" aria-hidden="true"></i></button>`);
      this.$btnBack = $(`<button type="button" title="${i18n.t("one_move_back")}" class="btn btn-link text-black back"><i class="fa fa-fw fa-step-backward" aria-hidden="true"></i></button>`);
      this.$btnForward = $(`<button type="button" title="${i18n.t("one_move_forward")}" class="btn btn-link text-black forward"><i class="fa fa-fw fa-step-forward" aria-hidden="true"></i></button>`);
      this.$btnLast = $(`<button type="button" title="${i18n.t("to_last_move")}" class="btn btn-link text-black last"><i class="fa fa-fw fa-fast-forward" aria-hidden="true"></i></button>`);
      this.$btnAutoplay = $(`<button type="button" title="${i18n.t("auto_run")}" class="btn btn-link text-black autoplay"><i class="fa fa-fw fa-play" aria-hidden="true"></i><i class="fa fa-fw fa-stop" aria-hidden="true"></i></button>`);
      this.$btnOrientation = $(`<button type="button" title="${i18n.t("turn_board")}" class="btn btn-link text-black orientation"><i class="fa fa-fw fa-exchange-alt fa-rotate-90" aria-hidden="true"></i></button>`);
      this.context.appendChild(this.$btnFirst[0]);
      this.context.appendChild(this.$btnBack[0]);
      this.context.appendChild(this.$btnForward[0]);
      this.context.appendChild(this.$btnLast[0]);
      this.context.appendChild(this.$btnAutoplay[0]);
      this.context.appendChild(this.$btnOrientation[0]);
      this.chessConsole.state.observeChess(() => {
        this.setButtonStates();
      });
      Observe.property(this.chessConsole.state, "plyViewed", () => {
        this.setButtonStates();
      });
      Observe.property(this.chessConsole.state, "orientation", () => {
        if (this.chessConsole.state.orientation !== this.chessConsole.props.playerColor) {
          this.$btnOrientation.addClass("btn-active");
        } else {
          this.$btnOrientation.removeClass("btn-active");
        }
      });
      this.$btnFirst.click(() => {
        this.chessConsole.state.plyViewed = 0;
        this.resetAutoPlay();
      });
      this.$btnBack.click(() => {
        this.chessConsole.state.plyViewed--;
        this.resetAutoPlay();
      });
      this.$btnForward.click(() => {
        this.chessConsole.state.plyViewed++;
        this.resetAutoPlay();
      });
      this.$btnLast.click(() => {
        this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount();
        this.resetAutoPlay();
      });
      this.$btnOrientation.click(() => {
        this.chessConsole.state.orientation = this.chessConsole.state.orientation === COLOR.white ? COLOR.black : COLOR.white;
      });
      this.$btnAutoplay.click(() => {
        if (this.autoplay) {
          clearInterval(this.autoplay);
          this.autoplay = null;
        } else {
          this.chessConsole.state.plyViewed++;
          this.autoplay = setInterval(this.autoPlayMove.bind(this), this.props.autoPlayDelay);
        }
        this.updatePlayIcon();
      });
      document.addEventListener("keydown", (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) {
          return;
        }
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "j") {
          if (this.chessConsole.state.plyViewed > 0) {
            this.chessConsole.state.plyViewed--;
            this.resetAutoPlay();
            e.preventDefault();
          }
        } else if (e.key === "ArrowRight" || e.key === "k") {
          if (this.chessConsole.state.plyViewed < this.chessConsole.state.chess.plyCount()) {
            this.chessConsole.state.plyViewed++;
            this.resetAutoPlay();
            e.preventDefault();
          }
        } else if (e.key === "ArrowUp") {
          this.chessConsole.state.plyViewed = 0;
          this.resetAutoPlay();
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount();
          this.resetAutoPlay();
          e.preventDefault();
        } else if (e.key === "f") {
          this.chessConsole.state.orientation = this.chessConsole.state.orientation === COLOR.white ? COLOR.black : COLOR.white;
          e.preventDefault();
        } else if (e.key === " ") {
          if (this.autoplay) {
            clearInterval(this.autoplay);
            this.autoplay = null;
          } else {
            if (this.chessConsole.state.plyViewed < this.chessConsole.state.chess.plyCount()) {
              this.chessConsole.state.plyViewed++;
              this.autoplay = setInterval(this.autoPlayMove.bind(this), this.props.autoPlayDelay);
            }
          }
          this.updatePlayIcon();
          e.preventDefault();
        }
      });
      this.setButtonStates();
    });
  }
  resetAutoPlay() {
    if (this.autoplay) {
      clearInterval(this.autoplay);
      this.autoplay = setInterval(this.autoPlayMove.bind(this), this.props.autoPlayDelay);
    }
  }
  autoPlayMove() {
    if (this.chessConsole.state.plyViewed >= this.chessConsole.state.chess.plyCount()) {
      clearInterval(this.autoplay);
      this.autoplay = null;
      this.updatePlayIcon();
    } else {
      this.chessConsole.state.plyViewed++;
      if (this.chessConsole.state.plyViewed >= this.chessConsole.state.chess.plyCount()) {
        clearInterval(this.autoplay);
        this.autoplay = null;
        this.updatePlayIcon();
      }
    }
  }
  updatePlayIcon() {
    const $playIcon = this.$btnAutoplay.find(".fa-play");
    const $stopIcon = this.$btnAutoplay.find(".fa-stop");
    if (this.autoplay) {
      $playIcon.hide();
      $stopIcon.show();
    } else {
      $playIcon.show();
      $stopIcon.hide();
    }
  }
  setButtonStates() {
    window.clearTimeout(this.redrawDebounce);
    this.redrawDebounce = setTimeout(() => {
      if (this.chessConsole.state.plyViewed > 0) {
        this.$btnFirst.prop("disabled", false);
        this.$btnBack.prop("disabled", false);
      } else {
        this.$btnFirst.prop("disabled", true);
        this.$btnBack.prop("disabled", true);
      }
      if (this.chessConsole.state.plyViewed < this.chessConsole.state.chess.plyCount()) {
        this.$btnLast.prop("disabled", false);
        this.$btnForward.prop("disabled", false);
        this.$btnAutoplay.prop("disabled", false);
      } else {
        this.$btnLast.prop("disabled", true);
        this.$btnForward.prop("disabled", true);
        this.$btnAutoplay.prop("disabled", true);
      }
    });
    this.updatePlayIcon();
  }
};
export {
  HistoryControl
};
//# sourceMappingURL=chess-console_src_components_HistoryControl__js.js.map
