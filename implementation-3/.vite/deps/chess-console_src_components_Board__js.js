import {
  Markers
} from "./chunk-2UUJ4VFT.js";
import {
  CONSOLE_MESSAGE_TOPICS,
  piecesTranslations,
  renderPieceTitle
} from "./chunk-YELVW5X7.js";
import "./chunk-6LVC5MS7.js";
import {
  DomUtils
} from "./chunk-TRKBLDR5.js";
import "./chunk-RHYLFANV.js";
import "./chunk-XZ62UXQF.js";
import {
  COLOR,
  Chessboard,
  FEN,
  INPUT_EVENT_TYPE,
  PIECE
} from "./chunk-22FRA7I2.js";
import {
  Svg,
  Utils
} from "./chunk-2NUPLSFN.js";
import {
  EXTENSION_POINT,
  Extension
} from "./chunk-WCRIPQW3.js";
import {
  Observe
} from "./chunk-5KWTC5XK.js";

// node_modules/cm-web-modules/src/utils/CoreUtils.js
var CoreUtils = class _CoreUtils {
  static debounce(callback, wait = 0, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      if (immediate && !timeout) {
        callback(...args);
        timeout = true;
      } else {
        const debounced = () => {
          clearTimeout(timeout);
          callback(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(debounced, wait);
      }
    };
  }
  static mergeObjects(target, source) {
    const isObject = (obj) => obj && typeof obj === "object";
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(source[key], _CoreUtils.mergeObjects(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
  static createTask() {
    let resolve, reject;
    const promise = new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
  }
};

// node_modules/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js
var DISPLAY_STATE = {
  hidden: "hidden",
  displayRequested: "displayRequested",
  shown: "shown"
};
var PROMOTION_DIALOG_RESULT_TYPE = {
  pieceSelected: "pieceSelected",
  canceled: "canceled"
};
var PromotionDialog = class extends Extension {
  /** @constructor */
  constructor(chessboard) {
    super(chessboard);
    this.registerExtensionPoint(EXTENSION_POINT.afterRedrawBoard, this.extensionPointRedrawBoard.bind(this));
    chessboard.showPromotionDialog = this.showPromotionDialog.bind(this);
    chessboard.isPromotionDialogShown = this.isPromotionDialogShown.bind(this);
    this.promotionDialogGroup = Svg.addElement(chessboard.view.interactiveTopLayer, "g", { class: "promotion-dialog-group" });
    this.state = {
      displayState: DISPLAY_STATE.hidden,
      callback: null,
      dialogParams: {
        square: null,
        color: null
      }
    };
  }
  // public (chessboard.showPromotionDialog)
  showPromotionDialog(square, color, callback) {
    this.state.dialogParams.square = square;
    this.state.dialogParams.color = color;
    this.state.callback = callback;
    this.setDisplayState(DISPLAY_STATE.displayRequested);
    setTimeout(
      () => {
        this.chessboard.view.positionsAnimationTask.then(() => {
          this.setDisplayState(DISPLAY_STATE.shown);
        });
      }
    );
  }
  // public (chessboard.isPromotionDialogShown)
  isPromotionDialogShown() {
    return this.state.displayState === DISPLAY_STATE.shown || this.state.displayState === DISPLAY_STATE.displayRequested;
  }
  // private
  extensionPointRedrawBoard() {
    this.redrawDialog();
  }
  drawPieceButton(piece, point) {
    const squareWidth = this.chessboard.view.squareWidth;
    const squareHeight = this.chessboard.view.squareHeight;
    Svg.addElement(
      this.promotionDialogGroup,
      "rect",
      {
        x: point.x,
        y: point.y,
        width: squareWidth,
        height: squareHeight,
        class: "promotion-dialog-button",
        "data-piece": piece
      }
    );
    this.chessboard.view.drawPiece(this.promotionDialogGroup, piece, point);
  }
  redrawDialog() {
    while (this.promotionDialogGroup.firstChild) {
      this.promotionDialogGroup.removeChild(this.promotionDialogGroup.firstChild);
    }
    if (this.state.displayState === DISPLAY_STATE.shown) {
      const squareWidth = this.chessboard.view.squareWidth;
      const squareHeight = this.chessboard.view.squareHeight;
      const squareCenterPoint = this.chessboard.view.squareToPoint(this.state.dialogParams.square);
      squareCenterPoint.x = squareCenterPoint.x + squareWidth / 2;
      squareCenterPoint.y = squareCenterPoint.y + squareHeight / 2;
      let turned = false;
      const rank = parseInt(this.state.dialogParams.square.charAt(1), 10);
      if (this.chessboard.getOrientation() === COLOR.white && rank < 5 || this.chessboard.getOrientation() === COLOR.black && rank >= 5) {
        turned = true;
      }
      const offsetY = turned ? -4 * squareHeight : 0;
      const offsetX = squareCenterPoint.x + squareWidth > this.chessboard.view.width ? -squareWidth : 0;
      Svg.addElement(
        this.promotionDialogGroup,
        "rect",
        {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + offsetY,
          width: squareWidth,
          height: squareHeight * 4,
          class: "promotion-dialog"
        }
      );
      const dialogParams = this.state.dialogParams;
      if (turned) {
        this.drawPieceButton(PIECE[dialogParams.color + "q"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight
        });
        this.drawPieceButton(PIECE[dialogParams.color + "r"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 2
        });
        this.drawPieceButton(PIECE[dialogParams.color + "b"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 3
        });
        this.drawPieceButton(PIECE[dialogParams.color + "n"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 4
        });
      } else {
        this.drawPieceButton(PIECE[dialogParams.color + "q"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y
        });
        this.drawPieceButton(PIECE[dialogParams.color + "r"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight
        });
        this.drawPieceButton(PIECE[dialogParams.color + "b"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight * 2
        });
        this.drawPieceButton(PIECE[dialogParams.color + "n"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight * 3
        });
      }
    }
  }
  promotionDialogOnClickPiece(event) {
    if (event.button !== 2) {
      if (event.target.dataset.piece) {
        if (this.state.callback) {
          this.state.callback({
            type: PROMOTION_DIALOG_RESULT_TYPE.pieceSelected,
            square: this.state.dialogParams.square,
            piece: event.target.dataset.piece
          });
        }
        this.setDisplayState(DISPLAY_STATE.hidden);
      } else {
        this.promotionDialogOnCancel(event);
      }
    }
  }
  promotionDialogOnCancel(event) {
    if (this.state.displayState === DISPLAY_STATE.shown) {
      event.preventDefault();
      this.setDisplayState(DISPLAY_STATE.hidden);
      if (this.state.callback) {
        this.state.callback({ type: PROMOTION_DIALOG_RESULT_TYPE.canceled });
      }
    }
  }
  contextMenu(event) {
    event.preventDefault();
    this.setDisplayState(DISPLAY_STATE.hidden);
    if (this.state.callback) {
      this.state.callback({ type: PROMOTION_DIALOG_RESULT_TYPE.canceled });
    }
  }
  setDisplayState(displayState) {
    this.state.displayState = displayState;
    if (displayState === DISPLAY_STATE.shown) {
      this.clickDelegate = Utils.delegate(
        this.chessboard.view.svg,
        "pointerdown",
        "*",
        this.promotionDialogOnClickPiece.bind(this)
      );
      this.contextMenuListener = this.contextMenu.bind(this);
      this.chessboard.view.svg.addEventListener("contextmenu", this.contextMenuListener);
    } else if (displayState === DISPLAY_STATE.hidden) {
      this.clickDelegate.remove();
      this.chessboard.view.svg.removeEventListener("contextmenu", this.contextMenuListener);
    }
    this.redrawDialog();
  }
};

// node_modules/cm-chessboard/src/extensions/accessibility/Accessibility.js
var translations = {
  de: {
    chessboard: "Schachbrett",
    pieces_lists: "Figurenlisten",
    board_as_table: "Schachbrett als Tabelle",
    move_piece: "Figur bewegen",
    from: "Zug von",
    to: "Zug nach",
    move: "Zug ausführen",
    input_white_enabled: "Eingabe Weiß aktiviert",
    input_black_enabled: "Eingabe Schwarz aktiviert",
    input_disabled: "Eingabe deaktiviert",
    pieces: "Figuren"
  },
  en: {
    chessboard: "Chessboard",
    pieces_lists: "Pieces lists",
    board_as_table: "Chessboard as table",
    move_piece: "Move piece",
    from: "Move from",
    to: "Move to",
    move: "Make move",
    input_white_enabled: "Input white enabled",
    input_black_enabled: "Input black enabled",
    input_disabled: "Input disabled",
    pieces: "Pieces"
  }
};
var Accessibility = class extends Extension {
  constructor(chessboard, props) {
    super(chessboard);
    this.props = {
      language: navigator.language.substring(0, 2).toLowerCase(),
      // supports "de" and "en" for now, used for pieces naming
      brailleNotationInAlt: true,
      // show the braille notation of the position in the alt attribute of the SVG image
      movePieceForm: true,
      // display a form to move a piece (from, to, move)
      boardAsTable: true,
      // display the board additionally as HTML table
      piecesAsList: true,
      // display the pieces additionally as List
      visuallyHidden: true
      // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
    };
    Object.assign(this.props, props);
    if (this.props.language !== "de" && this.props.language !== "en") {
      this.props.language = "en";
    }
    this.lang = this.props.language;
    this.tPieces = piecesTranslations[this.lang];
    this.t = translations[this.lang];
    this.components = [];
    if (this.props.movePieceForm || this.props.boardAsTable || this.props.piecesAsList) {
      const container = document.createElement("div");
      container.classList.add("cm-chessboard-accessibility");
      this.chessboard.context.appendChild(container);
      if (this.props.visuallyHidden) {
        container.classList.add("visually-hidden");
      }
      if (this.props.movePieceForm) {
        this.components.push(new MovePieceForm(container, this));
      }
      if (this.props.boardAsTable) {
        this.components.push(new BoardAsTable(container, this));
      }
      if (this.props.piecesAsList) {
        this.components.push(new PiecesAsList(container, this));
      }
    }
    if (this.props.brailleNotationInAlt) {
      this.components.push(new BrailleNotationInAlt(this));
    }
  }
};
var BrailleNotationInAlt = class {
  constructor(extension) {
    this.extension = extension;
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const pieces = this.extension.chessboard.state.position.getPieces();
    let listW = piecesTranslations[this.extension.lang].colors.w.toUpperCase() + ":";
    let listB = piecesTranslations[this.extension.lang].colors.b.toUpperCase() + ":";
    for (const piece of pieces) {
      const pieceName = piece.type === "p" ? "" : piecesTranslations[this.extension.lang].pieces[piece.type].toUpperCase();
      if (piece.color === "w") {
        listW += " " + pieceName + piece.position;
      } else {
        listB += " " + pieceName + piece.position;
      }
    }
    const altText = `${listW}
${listB}`;
    this.extension.chessboard.view.svg.setAttribute("alt", altText);
  }
};
var MovePieceForm = class {
  constructor(container, extension) {
    this.chessboard = extension.chessboard;
    this.movePieceFormContainer = Utils.createDomElement(`
<div>
    <h3 id="hl_form_${this.chessboard.id}">${extension.t.move_piece}</h3>
    <form aria-labelledby="hl_form_${this.chessboard.id}">
        <label for="move_piece_input_from_${this.chessboard.id}">${extension.t.from}</label>
        <input class="input-from" type="text" size="2" id="move_piece_input_from_${this.chessboard.id}"/>
        <label for="move_piece_input_to_${this.chessboard.id}">${extension.t.to}</label>
        <input class="input-to" type="text" size="2" id="move_piece_input_to_${this.chessboard.id}"/>
        <button type="submit" class="button-move">${extension.t.move}</button>
    </form>
</div>`);
    this.form = this.movePieceFormContainer.querySelector("form");
    this.inputFrom = this.form.querySelector(".input-from");
    this.inputTo = this.form.querySelector(".input-to");
    this.moveButton = this.form.querySelector(".button-move");
    this.form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (this.chessboard.state.moveInputCallback({
        chessboard: this.chessboard,
        type: INPUT_EVENT_TYPE.validateMoveInput,
        squareFrom: this.inputFrom.value,
        squareTo: this.inputTo.value
      })) {
        this.chessboard.movePiece(
          this.inputFrom.value,
          this.inputTo.value,
          true
        ).then(() => {
          this.inputFrom.value = "";
          this.inputTo.value = "";
        });
      }
    });
    container.appendChild(this.movePieceFormContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.moveInputToggled, () => {
      this.redraw();
    });
  }
  redraw() {
    if (this.inputFrom) {
      if (this.chessboard.state.inputWhiteEnabled || this.chessboard.state.inputBlackEnabled) {
        this.inputFrom.disabled = false;
        this.inputTo.disabled = false;
        this.moveButton.disabled = false;
      } else {
        this.inputFrom.disabled = true;
        this.inputTo.disabled = true;
        this.moveButton.disabled = true;
      }
    }
  }
};
var BoardAsTable = class {
  constructor(container, extension) {
    this.extension = extension;
    this.chessboard = extension.chessboard;
    this.boardAsTableContainer = Utils.createDomElement(`<div><h3 id="hl_table_${this.chessboard.id}">${extension.t.board_as_table}</h3><div class="table"></div></div>`);
    this.boardAsTable = this.boardAsTableContainer.querySelector(".table");
    container.appendChild(this.boardAsTableContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
    extension.registerExtensionPoint(EXTENSION_POINT.boardChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const squares = this.chessboard.state.position.squares.slice();
    const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const files = ["8", "7", "6", "5", "4", "3", "2", "1"];
    if (this.chessboard.state.orientation === COLOR.black) {
      ranks.reverse();
      files.reverse();
      squares.reverse();
    }
    let html = `<table aria-labelledby="hl_table_${this.chessboard.id}"><tr><th></th>`;
    for (const rank of ranks) {
      html += `<th scope='col'>${rank}</th>`;
    }
    html += "</tr>";
    for (let x = 7; x >= 0; x--) {
      html += `<tr><th scope="row">${files[7 - x]}</th>`;
      for (let y = 0; y < 8; y++) {
        const pieceCode = squares[y % 8 + x * 8];
        let color, name;
        if (pieceCode) {
          color = pieceCode.charAt(0);
          name = pieceCode.charAt(1);
          html += `<td>${renderPieceTitle(this.extension.lang, name, color)}</td>`;
        } else {
          html += `<td></td>`;
        }
      }
      html += "</tr>";
    }
    html += "</table>";
    this.boardAsTable.innerHTML = html;
  }
};
var PiecesAsList = class {
  constructor(container, extension) {
    this.extension = extension;
    this.chessboard = extension.chessboard;
    this.piecesListContainer = Utils.createDomElement(`<div><h3 id="hl_lists_${this.chessboard.id}">${extension.t.pieces_lists}</h3><div class="list"></div></div>`);
    this.piecesList = this.piecesListContainer.querySelector(".list");
    container.appendChild(this.piecesListContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const pieces = this.chessboard.state.position.getPieces();
    let listW = "";
    let listB = "";
    for (const piece of pieces) {
      if (piece.color === "w") {
        listW += `<li class="list-inline-item">${renderPieceTitle(this.extension.lang, piece.type)} ${piece.position}</li>`;
      } else {
        listB += `<li class="list-inline-item">${renderPieceTitle(this.extension.lang, piece.type)} ${piece.position}</li>`;
      }
    }
    this.piecesList.innerHTML = `
        <h4 id="white_${this.chessboard.id}">${this.extension.t.pieces} ${this.extension.tPieces.colors_long.w}</h4>
        <ul aria-labelledby="white_${this.chessboard.id}" class="list-inline">${listW}</ul>
        <h4 id="black_${this.chessboard.id}">${this.extension.t.pieces} ${this.extension.tPieces.colors_long.b}</h4>
        <ul aria-labelledby="black_${this.chessboard.id}" class="list-inline">${listB}</ul>`;
  }
};

// node_modules/cm-chessboard/src/extensions/auto-border-none/AutoBorderNone.js
var AutoBorderNone = class extends Extension {
  constructor(chessboard, props = {}) {
    super(chessboard);
    this.props = {
      chessboardBorderType: chessboard.props.style.borderType,
      borderNoneBelow: 540
      // pixels width of the board, where the border is set to none
    };
    Object.assign(this.props, props);
    this.registerExtensionPoint(EXTENSION_POINT.beforeRedrawBoard, this.extensionPointBeforeRedrawBoard.bind(this));
  }
  extensionPointBeforeRedrawBoard() {
    let newBorderType;
    if (this.chessboard.view.width < this.props.borderNoneBelow) {
      newBorderType = "none";
    } else {
      newBorderType = this.props.chessboardBorderType;
    }
    if (newBorderType !== this.chessboard.props.style.borderType) {
      this.chessboard.props.style.borderType = newBorderType;
      this.chessboard.view.updateMetrics();
    }
  }
};

// node_modules/chess-console/src/components/Board.js
var CONSOLE_MARKER_TYPE = {
  moveInput: { class: "marker-frame", slice: "markerFrame" },
  check: { class: "marker-circle-danger", slice: "markerCircle" },
  wrongMove: { class: "marker-frame-danger", slice: "markerFrame" },
  premove: { class: "marker-frame-primary", slice: "markerFrame" },
  legalMove: { class: "marker-dot", slice: "markerDot" },
  legalMoveCapture: { class: "marker-bevel", slice: "markerBevel" }
};
var Board = class {
  constructor(chessConsole, props = {}) {
    this.context = chessConsole.componentContainers.board;
    chessConsole.components.board = this;
    this.initialized = new Promise((resolve) => {
      this.i18n = chessConsole.i18n;
      this.i18n.load({
        de: {
          chessBoard: "Schachbrett"
        },
        en: {
          chessBoard: "Chess Board"
        }
      }).then(() => {
        this.chessConsole = chessConsole;
        this.elements = {
          playerTop: document.createElement("div"),
          playerBottom: document.createElement("div"),
          chessboard: document.createElement("div")
        };
        this.elements.playerTop.setAttribute("class", "player top");
        this.elements.playerTop.innerHTML = "&nbsp;";
        this.elements.playerBottom.setAttribute("class", "player bottom");
        this.elements.playerBottom.innerHTML = "&nbsp;";
        this.elements.chessboard.setAttribute("class", "chessboard");
        this.context.appendChild(DomUtils.createElement("<h2 class='visually-hidden'>" + this.i18n.t("chessBoard") + "</h2>"));
        this.context.appendChild(this.elements.playerTop);
        this.context.appendChild(this.elements.chessboard);
        this.context.appendChild(this.elements.playerBottom);
        this.chessConsole.state.observeChess((params) => {
          let animated = true;
          if (params.functionName === "load_pgn") {
            animated = false;
          }
          this.setPositionOfPlyViewed(animated);
          this.markLastMove();
        });
        Observe.property(this.chessConsole.state, "plyViewed", (props2) => {
          this.setPositionOfPlyViewed(props2.oldValue !== void 0);
          this.markLastMove();
        });
        this.props = {
          position: FEN.empty,
          orientation: chessConsole.state.orientation,
          assetsUrl: void 0,
          markLegalMoves: true,
          style: {
            aspectRatio: 0.98
          },
          accessibility: {
            active: true,
            // turn accessibility on or off
            brailleNotationInAlt: true,
            // show the braille notation of the position in the alt attribute of the SVG image
            movePieceForm: true,
            // display a form to move a piece (from, to, move)
            boardAsTable: true,
            // display the board additionally as HTML table
            piecesAsList: true,
            // display the pieces additionally as List
            visuallyHidden: true
            // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
          },
          markers: {
            moveInput: CONSOLE_MARKER_TYPE.moveInput,
            check: CONSOLE_MARKER_TYPE.check,
            wrongMove: CONSOLE_MARKER_TYPE.wrongMove,
            premove: CONSOLE_MARKER_TYPE.premove,
            legalMove: CONSOLE_MARKER_TYPE.legalMove,
            legalMoveCapture: CONSOLE_MARKER_TYPE.legalMoveCapture
          },
          extensions: [{ class: PromotionDialog }, {
            class: ChessConsoleMarkers,
            props: {
              board: this,
              autoMarkers: props.markers && props.markers.moveInput ? { ...props.markers.moveInput } : { ...CONSOLE_MARKER_TYPE.moveInput }
            }
          }, { class: AutoBorderNone, props: { borderNoneBelow: 580 } }]
        };
        CoreUtils.mergeObjects(this.props, props);
        if (this.props.accessibility.active) {
          this.props.extensions.push({
            class: Accessibility,
            props: this.props.accessibility
          });
        }
        this.chessboard = new Chessboard(this.elements.chessboard, this.props);
        Observe.property(chessConsole.state, "orientation", () => {
          this.setPlayerNames();
          this.chessboard.setOrientation(chessConsole.state.orientation).then(() => {
            this.markPlayerToMove();
          });
        });
        Observe.property(chessConsole.player, "name", () => {
          this.setPlayerNames();
        });
        Observe.property(chessConsole.opponent, "name", () => {
          this.setPlayerNames();
        });
        chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveRequest, () => {
          this.markPlayerToMove();
        });
        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.illegalMove, (message) => {
          this.chessboard.removeMarkers(this.props.markers.wrongMove);
          clearTimeout(this.removeMarkersTimeout);
          if (message.move.from) {
            this.chessboard.addMarker(this.props.markers.wrongMove, message.move.from);
          } else {
            console.warn("illegalMove without `message.move.from`");
          }
          if (message.move.to) {
            this.chessboard.addMarker(this.props.markers.wrongMove, message.move.to);
          }
          this.removeMarkersTimeout = setTimeout(() => {
            this.chessboard.removeMarkers(this.props.markers.wrongMove);
          }, 500);
        });
        this.setPositionOfPlyViewed(false);
        this.setPlayerNames();
        this.markPlayerToMove();
        this.markLastMove();
        resolve(this);
      });
    });
    this.initialization = this.initialized;
  }
  setPositionOfPlyViewed(animated = true) {
    clearTimeout(this.setPositionOfPlyViewedDebounced);
    this.setPositionOfPlyViewedDebounced = setTimeout(() => {
      const to = this.chessConsole.state.chess.fenOfPly(this.chessConsole.state.plyViewed);
      this.chessboard.setPosition(to, animated);
    });
  }
  markLastMove() {
    window.clearTimeout(this.markLastMoveDebounce);
    this.markLastMoveDebounce = setTimeout(() => {
      this.chessboard.removeMarkers(this.props.markers.moveInput);
      this.chessboard.removeMarkers(this.props.markers.check);
      if (this.chessConsole.state.plyViewed > 0) {
        const lastMove = this.chessConsole.state.chess.history()[this.chessConsole.state.plyViewed - 1];
        if (lastMove) {
          this.chessboard.addMarker(this.props.markers.moveInput, lastMove.from);
          this.chessboard.addMarker(this.props.markers.moveInput, lastMove.to);
          if (this.chessConsole.state.chess.inCheck(lastMove) || this.chessConsole.state.chess.inCheckmate(lastMove)) {
            const kingSquare = this.chessConsole.state.chess.pieces("k", this.chessConsole.state.chess.turn(lastMove), lastMove)[0];
            this.chessboard.addMarker(this.props.markers.check, kingSquare.square);
          }
        }
      }
    });
  }
  setPlayerNames() {
    window.clearTimeout(this.setPlayerNamesDebounce);
    this.setPlayerNamesDebounce = setTimeout(() => {
      if (this.chessConsole.props.playerColor === this.chessConsole.state.orientation) {
        this.elements.playerBottom.innerHTML = this.chessConsole.player.name;
        this.elements.playerTop.innerHTML = this.chessConsole.opponent.name;
      } else {
        this.elements.playerBottom.innerHTML = this.chessConsole.opponent.name;
        this.elements.playerTop.innerHTML = this.chessConsole.player.name;
      }
    });
  }
  markPlayerToMove() {
    clearTimeout(this.markPlayerToMoveDebounce);
    this.markPlayerToMoveDebounce = setTimeout(() => {
      this.elements.playerTop.classList.remove("to-move");
      this.elements.playerBottom.classList.remove("to-move");
      this.elements.playerTop.classList.remove("not-to-move");
      this.elements.playerBottom.classList.remove("not-to-move");
      const playerMove = this.chessConsole.playerToMove();
      if (this.chessConsole.state.orientation === COLOR.white && playerMove === this.chessConsole.playerWhite() || this.chessConsole.state.orientation === COLOR.black && playerMove === this.chessConsole.playerBlack()) {
        this.elements.playerBottom.classList.add("to-move");
        this.elements.playerTop.classList.add("not-to-move");
      } else {
        this.elements.playerTop.classList.add("to-move");
        this.elements.playerBottom.classList.add("not-to-move");
      }
    }, 10);
  }
};
var ChessConsoleMarkers = class extends Markers {
  drawAutoMarkers(event) {
    clearTimeout(this.drawAutoMarkersDebounced);
    this.drawAutoMarkersDebounced = setTimeout(
      () => {
        this.removeMarkers(this.props.autoMarkers);
        const board = this.props.board;
        const moves = this.props.board.chessConsole.state.chess.moves({ square: event.square, verbose: true });
        if (board.props.markLegalMoves) {
          if (event.type === INPUT_EVENT_TYPE.moveInputStarted || event.type === INPUT_EVENT_TYPE.validateMoveInput || event.type === INPUT_EVENT_TYPE.moveInputCanceled || event.type === INPUT_EVENT_TYPE.moveInputFinished) {
            event.chessboard.removeMarkers(board.props.markers.legalMove);
            event.chessboard.removeMarkers(board.props.markers.legalMoveCapture);
          }
          if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
            for (const move of moves) {
              if (move.promotion && move.promotion !== "q") {
                continue;
              }
              if (event.chessboard.getPiece(move.to)) {
                event.chessboard.addMarker(board.props.markers.legalMoveCapture, move.to);
              } else {
                event.chessboard.addMarker(board.props.markers.legalMove, move.to);
              }
            }
          }
        }
        if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
          if (event.moveInputCallbackResult) {
            this.addMarker(this.props.autoMarkers, event.squareFrom);
          }
        } else if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
          this.addMarker(this.props.autoMarkers, event.squareFrom);
          if (event.squareTo) {
            this.addMarker(this.props.autoMarkers, event.squareTo);
          }
        }
      }
    );
  }
};
export {
  Board,
  CONSOLE_MARKER_TYPE
};
//# sourceMappingURL=chess-console_src_components_Board__js.js.map
