import {
  Component
} from "./chunk-PMAS7DIH.js";
import {
  CONSOLE_MESSAGE_TOPICS
} from "./chunk-YELVW5X7.js";
import "./chunk-6LVC5MS7.js";
import "./chunk-TRKBLDR5.js";
import {
  COLOR
} from "./chunk-RHYLFANV.js";
import "./chunk-XZ62UXQF.js";
import "./chunk-22FRA7I2.js";
import "./chunk-2NUPLSFN.js";
import "./chunk-WCRIPQW3.js";
import "./chunk-5KWTC5XK.js";

// node_modules/chess-console/src/components/Persistence.js
var Persistence = class extends Component {
  constructor(chessConsole, props) {
    super(props);
    this.chessConsole = chessConsole;
    if (!this.props.savePrefix) {
      this.props.savePrefix = "ChessConsole";
    }
    this.chessConsole.state.observeChess(() => {
      this.save();
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.newGame, () => {
      this.save();
    });
    this.chessConsole.persistence = this;
  }
  load(prefix = this.props.savePrefix) {
    const props = {};
    try {
      if (this.loadValue("PlayerColor") !== null) {
        props.playerColor = this.loadValue("PlayerColor");
      } else {
        props.playerColor = COLOR.white;
      }
      if (localStorage.getItem(prefix + "Pgn") !== null) {
        props.pgn = localStorage.getItem(prefix + "Pgn");
      }
      this.chessConsole.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.load);
      this.chessConsole.initGame(props);
    } catch (e) {
      localStorage.clear();
      console.warn(e);
      this.chessConsole.initGame({ playerColor: COLOR.white });
    }
  }
  loadValue(valueName, prefix = this.props.savePrefix) {
    let item = null;
    try {
      item = localStorage.getItem(prefix + valueName);
      return JSON.parse(item);
    } catch (e) {
      console.error("error loading ", prefix + valueName);
      console.error("item:" + item);
      console.error(e);
    }
  }
  save(prefix = this.props.savePrefix) {
    localStorage.setItem(prefix + "PlayerColor", JSON.stringify(this.chessConsole.props.playerColor));
    localStorage.setItem(prefix + "Pgn", this.chessConsole.state.chess.renderPgn());
  }
  saveValue(valueName, value, prefix = this.props.savePrefix) {
    localStorage.setItem(prefix + valueName, JSON.stringify(value));
  }
};
export {
  Persistence
};
//# sourceMappingURL=chess-console_src_components_Persistence__js.js.map
