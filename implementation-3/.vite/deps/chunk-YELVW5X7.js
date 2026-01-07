import {
  I18n
} from "./chunk-6LVC5MS7.js";
import {
  DomUtils
} from "./chunk-TRKBLDR5.js";
import {
  Chess,
  FEN,
  GAME_VARIANT
} from "./chunk-RHYLFANV.js";
import {
  COLOR
} from "./chunk-22FRA7I2.js";
import {
  Observe
} from "./chunk-5KWTC5XK.js";

// node_modules/cm-web-modules/src/message-broker/MessageBroker.js
var MessageBroker = class {
  constructor() {
    this.topics = [];
  }
  subscribe(topic, callback) {
    if (!topic) {
      const message = "subscribe: topic needed";
      console.error(message, callback);
      throw new Error(message);
    }
    if (!callback) {
      const message = "subscribe: callback needed";
      console.error(message, topic);
      throw new Error(message);
    }
    if (this.topics[topic] === void 0) {
      this.topics[topic] = [];
    }
    if (this.topics[topic].indexOf(callback) === -1) {
      this.topics[topic].push(callback);
    }
  }
  unsubscribe(topic = null, callback = null) {
    if (callback !== null && topic !== null) {
      this.topics[topic].splice(this.topics[topic].indexOf(callback), 1);
    } else if (callback === null && topic !== null) {
      this.topics[topic] = [];
    } else if (topic === null && callback !== null) {
      for (const topicName in this.topics) {
        const topic2 = this.topics[topicName];
        for (const topicSubscriber of topic2) {
          if (topicSubscriber === callback) {
            this.unsubscribe(topicName, callback);
          }
        }
      }
    } else {
      this.topics = [];
    }
    if (topic !== null) {
      if (this.topics[topic] && this.topics[topic].length === 0) {
        delete this.topics[topic];
      }
    }
  }
  publish(topic, object = {}, async = true) {
    if (!topic) {
      const message = "publish: topic needed";
      console.error(message, object);
      throw new Error(message);
    }
    const breadcrumbArray = topic.split("/");
    let wildcardTopic = "";
    for (const topicPart of breadcrumbArray) {
      this.callback(wildcardTopic + "#", topic, object, async);
      wildcardTopic += topicPart + "/";
    }
    this.callback(topic, topic, object, async);
  }
  callback(wildcardTopic, topic, object = {}, async = true) {
    if (this.topics[wildcardTopic]) {
      this.topics[wildcardTopic].forEach(function(callback) {
        if (async) {
          setTimeout(function() {
            callback(object, topic);
          });
        } else {
          return callback(object, topic);
        }
      });
    }
  }
};

// node_modules/cm-chessboard/src/extensions/accessibility/I18n.js
var piecesTranslations = {
  en: {
    colors: {
      w: "w",
      b: "b"
    },
    colors_long: {
      w: "White",
      b: "Black"
    },
    pieces: {
      p: "p",
      n: "n",
      b: "b",
      r: "r",
      q: "q",
      k: "k"
    },
    pieces_long: {
      p: "Pawn",
      n: "Knight",
      b: "Bishop",
      r: "Rook",
      q: "Queen",
      k: "King"
    }
  },
  de: {
    colors: {
      w: "w",
      b: "s"
    },
    colors_long: {
      w: "Weiß",
      b: "Schwarz"
    },
    pieces: {
      p: "b",
      n: "s",
      b: "l",
      r: "t",
      q: "d",
      k: "k"
    },
    pieces_long: {
      p: "Bauer",
      n: "Springer",
      b: "Läufer",
      r: "Turm",
      q: "Dame",
      k: "König"
    }
  }
};
function renderPieceTitle(lang, name, color = void 0) {
  let title = piecesTranslations[lang].pieces_long[name];
  if (color) {
    title += " " + piecesTranslations[lang].colors_long[color];
  }
  return title;
}

// node_modules/chess-console/src/ChessConsoleState.js
var ChessConsoleState = class {
  constructor(props) {
    this.chess = new Chess();
    this.orientation = props.playerColor || COLOR.white;
    this.plyViewed = void 0;
  }
  observeChess(callback) {
    const chessManipulationMethods = [
      "move",
      "clear",
      "load",
      "loadPgn",
      "put",
      "remove",
      "reset",
      "undo"
    ];
    chessManipulationMethods.forEach((methodName) => {
      Observe.postFunction(this.chess, methodName, (params) => {
        callback(params);
      });
    });
  }
};

// node_modules/chess-console/src/ChessConsole.js
var CONSOLE_MESSAGE_TOPICS = {
  newGame: "game/new",
  // if a new game was startet
  initGame: "game/init",
  // after a page reload and when a new game was started
  gameOver: "game/over",
  moveRequest: "game/moveRequest",
  legalMove: "game/move/legal",
  illegalMove: "game/move/illegal",
  moveUndone: "game/move/undone",
  // mainly for sound
  load: "game/load"
};
var ChessConsole = class {
  constructor(context, player, opponent, props = {}, state = new ChessConsoleState(props)) {
    this.context = context;
    this.state = state;
    this.props = {
      locale: navigator.language,
      // locale for i18n
      playerColor: COLOR.white,
      // the players color (color at bottom)
      gameVariant: GAME_VARIANT.standard,
      pgn: void 0,
      // initial pgn, can contain header and history
      accessible: false
      // render additional information to improve the usage for persons using screen readers
    };
    if (!this.props.figures) {
      this.props.figures = {
        Rw: '<i class="fas fa-fw fa-chess-rook fa-figure-white"></i>',
        Nw: '<i class="fas fa-fw fa-chess-knight fa-figure-white"></i>',
        Bw: '<i class="fas fa-fw fa-chess-bishop fa-figure-white"></i>',
        Qw: '<i class="fas fa-fw fa-chess-queen fa-figure-white"></i>',
        Kw: '<i class="fas fa-fw fa-chess-king fa-figure-white"></i>',
        Pw: '<i class="fas fa-fw fa-chess-pawn fa-figure-white"></i>',
        Rb: '<i class="fas fa-fw fa-chess-rook fa-figure-black"></i>',
        Nb: '<i class="fas fa-fw fa-chess-knight fa-figure-black"></i>',
        Bb: '<i class="fas fa-fw fa-chess-bishop fa-figure-black"></i>',
        Qb: '<i class="fas fa-fw fa-chess-queen fa-figure-black"></i>',
        Kb: '<i class="fas fa-fw fa-chess-king fa-figure-black"></i>',
        Pb: '<i class="fas fa-fw fa-chess-pawn fa-figure-black"></i>'
      };
    }
    const colSets = {
      consoleGame: "col-xl-7 order-xl-2 col-lg-8 order-lg-1 order-md-1 col-md-12",
      consoleRight: "col-xl-3 order-xl-3 col-lg-4 order-lg-2 col-md-8 order-md-3",
      consoleLeft: "col-xl-2 order-xl-1 order-lg-3 col-lg-12 col-md-4 order-md-2"
    };
    this.initialized = new Promise(((resolve) => {
      this.i18n = new I18n({ locale: props.locale });
      this.i18n.load({
        de: {
          ok: "OK",
          cancel: "Abbrechen"
        },
        en: {
          ok: "OK",
          cancel: "Cancel"
        }
      }).then(() => {
        this.i18n.load(piecesTranslations).then(() => {
          resolve(this);
        });
      });
    }));
    this.initialization = this.initialized;
    if (!this.props.template) {
      this.props.template = `
                <div class="row chess-console">
                    <div class="chess-console-center ${colSets.consoleGame}">
                        <div class="chess-console-board"></div>
                    </div>
                    <div class="chess-console-right ${colSets.consoleRight}">
                        <div class="control-buttons buttons-grid mb-4"></div>
                        <div class="chess-console-notifications"></div>
                    </div>
                    <div class="chess-console-left ${colSets.consoleLeft}">
                        <div class="row">
                            <div class="col-xl-12 col-lg-4 col-md-12 col-6">
                                <div class="chess-console-history"></div>
                            </div>
                            <div class="col-xl-12 col-lg-8 col-md-12 col-6">
                                <div class="chess-console-captured"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    Object.assign(this.props, props);
    this.messageBroker = new MessageBroker();
    const innerHTMLElement = DomUtils.createElement(this.context.innerHTML);
    if (!(innerHTMLElement instanceof Element) || !innerHTMLElement.querySelector(".chess-console") && !innerHTMLElement.classList.contains("chess-console")) {
      this.context.innerHTML = this.props.template;
    }
    this.componentContainers = {
      center: this.context.querySelector(".chess-console-center"),
      left: this.context.querySelector(".chess-console-left"),
      right: this.context.querySelector(".chess-console-right"),
      board: this.context.querySelector(".chess-console-board"),
      controlButtons: this.context.querySelector(".control-buttons"),
      notifications: this.context.querySelector(".chess-console-notifications")
    };
    this.components = {
      // put here components, which want to be accessible from other components
    };
    this.player = new player.type(this, player.name, player.props);
    this.opponent = new opponent.type(this, opponent.name, opponent.props);
    this.persistence = void 0;
  }
  initGame(props = {}, requestNextMove = true) {
    Object.assign(this.props, props);
    this.state.orientation = this.props.playerColor;
    if (props.pgn) {
      this.state.chess.loadPgn(props.pgn, true);
      this.props.gameVariant = this.state.chess.props.gameVariant;
      this.state.plyViewed = this.state.chess.plyCount();
    } else {
      this.state.chess.load(FEN.start);
      this.state.plyViewed = 0;
    }
    if (requestNextMove) {
      this.nextMove();
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.initGame, { props });
  }
  newGame(props = {}) {
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.newGame, { props });
    this.initGame(props);
    if (this.components.board.chessboard) {
      this.components.board.chessboard.disableMoveInput();
    }
  }
  playerWhite() {
    return this.props.playerColor === COLOR.white ? this.player : this.opponent;
  }
  playerBlack() {
    return this.props.playerColor === COLOR.white ? this.opponent : this.player;
  }
  playerToMove() {
    if (this.state.chess.gameOver()) {
      return null;
    } else {
      if (this.state.chess.turn() === "w") {
        return this.playerWhite();
      } else {
        return this.playerBlack();
      }
    }
  }
  /*
   * - calls `moveRequest()` in next player
   */
  nextMove() {
    const playerToMove = this.playerToMove();
    if (playerToMove) {
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.moveRequest, { playerToMove });
      setTimeout(() => {
        playerToMove.moveRequest(this.state.chess.fen(), (move) => {
          return this.handleMoveResponse(move);
        });
      });
    }
  }
  /*
   * - validates move
   * - requests nextMove
   */
  handleMoveResponse(move) {
    const playerMoved = this.playerToMove();
    const moveResult = this.state.chess.move(move);
    if (!moveResult) {
      if (this.props.debug) {
        console.warn("illegalMove", this.state.chess, move);
      }
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.illegalMove, {
        playerMoved,
        move
      });
      return moveResult;
    }
    if (this.state.plyViewed === this.state.chess.plyCount() - 1) {
      this.state.plyViewed++;
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.legalMove, {
      playerMoved,
      move,
      moveResult
    });
    if (!this.state.chess.gameOver()) {
      this.nextMove();
    } else {
      let wonColor = null;
      if (this.state.chess.inCheckmate()) {
        wonColor = this.state.chess.turn() === COLOR.white ? COLOR.black : COLOR.white;
      }
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.gameOver, { wonColor });
    }
    return moveResult;
  }
  undoMove() {
    this.components.board.chessboard.disableMoveInput();
    this.state.chess.undo();
    if (this.playerToMove() !== this.player) {
      this.state.chess.undo();
    }
    if (this.state.plyViewed > this.state.chess.plyCount()) {
      this.state.plyViewed = this.state.chess.plyCount();
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.moveUndone);
    this.nextMove();
  }
};

export {
  piecesTranslations,
  renderPieceTitle,
  CONSOLE_MESSAGE_TOPICS,
  ChessConsole
};
//# sourceMappingURL=chunk-YELVW5X7.js.map
