import {
  Svg,
  Utils
} from "./chunk-2NUPLSFN.js";
import {
  EXTENSION_POINT
} from "./chunk-WCRIPQW3.js";

// node_modules/cm-chessboard/src/model/Position.js
var FEN = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  empty: "8/8/8/8/8/8/8/8"
};
var Position = class _Position {
  constructor(fen = FEN.empty) {
    this.squares = new Array(64).fill(null);
    this.setFen(fen);
  }
  setFen(fen = FEN.empty) {
    const parts = fen.replace(/^\s*/, "").replace(/\s*$/, "").split(/\/|\s/);
    for (let part = 0; part < 8; part++) {
      const row = parts[7 - part].replace(/\d/g, (str) => {
        const numSpaces = parseInt(str);
        let ret = "";
        for (let i = 0; i < numSpaces; i++) {
          ret += "-";
        }
        return ret;
      });
      for (let c = 0; c < 8; c++) {
        const char = row.substring(c, c + 1);
        let piece = null;
        if (char !== "-") {
          if (char.toUpperCase() === char) {
            piece = `w${char.toLowerCase()}`;
          } else {
            piece = `b${char}`;
          }
        }
        this.squares[part * 8 + c] = piece;
      }
    }
  }
  getFen() {
    let parts = new Array(8).fill("");
    for (let part = 0; part < 8; part++) {
      let spaceCounter = 0;
      for (let i = 0; i < 8; i++) {
        const piece = this.squares[part * 8 + i];
        if (!piece) {
          spaceCounter++;
        } else {
          if (spaceCounter > 0) {
            parts[7 - part] += spaceCounter;
            spaceCounter = 0;
          }
          const color = piece.substring(0, 1);
          const name = piece.substring(1, 2);
          if (color === "w") {
            parts[7 - part] += name.toUpperCase();
          } else {
            parts[7 - part] += name;
          }
        }
      }
      if (spaceCounter > 0) {
        parts[7 - part] += spaceCounter;
        spaceCounter = 0;
      }
    }
    return parts.join("/");
  }
  getPieces(pieceColor = void 0, pieceType = void 0, sortBy = ["k", "q", "r", "b", "n", "p"]) {
    const pieces = [];
    const sort = (a, b) => {
      return sortBy.indexOf(a.name) - sortBy.indexOf(b.name);
    };
    for (let i = 0; i < 64; i++) {
      const piece = this.squares[i];
      if (piece) {
        const type = piece.charAt(1);
        const color = piece.charAt(0);
        const square = _Position.indexToSquare(i);
        if (pieceType && pieceType !== type || pieceColor && pieceColor !== color) {
          continue;
        }
        pieces.push({
          name: type,
          // deprecated, use type
          type,
          color,
          position: square,
          // deprecated, use square
          square
        });
      }
    }
    if (sortBy) {
      pieces.sort(sort);
    }
    return pieces;
  }
  movePiece(squareFrom, squareTo) {
    if (!this.squares[_Position.squareToIndex(squareFrom)]) {
      console.warn("no piece on", squareFrom);
      return;
    }
    this.squares[_Position.squareToIndex(squareTo)] = this.squares[_Position.squareToIndex(squareFrom)];
    this.squares[_Position.squareToIndex(squareFrom)] = null;
  }
  setPiece(square, piece) {
    this.squares[_Position.squareToIndex(square)] = piece;
  }
  getPiece(square) {
    return this.squares[_Position.squareToIndex(square)];
  }
  static squareToIndex(square) {
    const coordinates = _Position.squareToCoordinates(square);
    return coordinates[0] + coordinates[1] * 8;
  }
  static indexToSquare(index) {
    return this.coordinatesToSquare([Math.floor(index % 8), index / 8]);
  }
  static squareToCoordinates(square) {
    const file = square.charCodeAt(0) - 97;
    const rank = square.charCodeAt(1) - 49;
    return [file, rank];
  }
  static coordinatesToSquare(coordinates) {
    const file = String.fromCharCode(coordinates[0] + 97);
    const rank = String.fromCharCode(coordinates[1] + 49);
    return file + rank;
  }
  toString() {
    return this.getFen();
  }
  clone() {
    const cloned = new _Position();
    cloned.squares = this.squares.slice(0);
    return cloned;
  }
};

// node_modules/cm-chessboard/src/model/ChessboardState.js
var ChessboardState = class {
  constructor() {
    this.position = new Position();
    this.orientation = void 0;
    this.inputWhiteEnabled = false;
    this.inputBlackEnabled = false;
    this.squareSelectEnabled = false;
    this.moveInputCallback = null;
    this.extensionPoints = {};
    this.moveInputProcess = Promise.resolve();
  }
  inputEnabled() {
    return this.inputWhiteEnabled || this.inputBlackEnabled;
  }
  invokeExtensionPoints(name, data = {}) {
    const extensionPoints = this.extensionPoints[name];
    const dataCloned = Object.assign({}, data);
    dataCloned.extensionPoint = name;
    let returnValue = true;
    if (extensionPoints) {
      for (const extensionPoint of extensionPoints) {
        if (extensionPoint(dataCloned) === false) {
          returnValue = false;
        }
      }
    }
    return returnValue;
  }
};

// node_modules/cm-chessboard/src/view/PositionAnimationsQueue.js
var ANIMATION_EVENT_TYPE = {
  start: "start",
  frame: "frame",
  end: "end"
};
var PromiseQueue = class {
  constructor() {
    this.queue = [];
    this.workingOnPromise = false;
    this.stop = false;
  }
  async enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject
      });
      this.dequeue();
    });
  }
  dequeue() {
    if (this.workingOnPromise) {
      return;
    }
    if (this.stop) {
      this.queue = [];
      this.stop = false;
      return;
    }
    const entry = this.queue.shift();
    if (!entry) {
      return;
    }
    try {
      this.workingOnPromise = true;
      entry.promise().then((value) => {
        this.workingOnPromise = false;
        entry.resolve(value);
        this.dequeue();
      }).catch((err) => {
        this.workingOnPromise = false;
        entry.reject(err);
        this.dequeue();
      });
    } catch (err) {
      this.workingOnPromise = false;
      entry.reject(err);
      this.dequeue();
    }
    return true;
  }
  destroy() {
    this.stop = true;
  }
};
var CHANGE_TYPE = {
  move: 0,
  appear: 1,
  disappear: 2
};
var PositionsAnimation = class _PositionsAnimation {
  constructor(view, fromPosition, toPosition, duration, callback) {
    this.view = view;
    if (fromPosition && toPosition) {
      this.animatedElements = this.createAnimation(fromPosition.squares, toPosition.squares);
      this.duration = duration;
      this.callback = callback;
      this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
    } else {
      console.error("fromPosition", fromPosition, "toPosition", toPosition);
    }
    this.view.positionsAnimationTask = Utils.createTask();
    this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
      type: ANIMATION_EVENT_TYPE.start
    });
  }
  static seekChanges(fromSquares, toSquares) {
    const appearedList = [], disappearedList = [], changes = [];
    for (let i = 0; i < 64; i++) {
      const previousSquare = fromSquares[i];
      const newSquare = toSquares[i];
      if (newSquare !== previousSquare) {
        if (newSquare) {
          appearedList.push({ piece: newSquare, index: i });
        }
        if (previousSquare) {
          disappearedList.push({ piece: previousSquare, index: i });
        }
      }
    }
    appearedList.forEach((appeared) => {
      let shortestDistance = 8;
      let foundMoved = null;
      disappearedList.forEach((disappeared) => {
        if (appeared.piece === disappeared.piece) {
          const moveDistance = _PositionsAnimation.squareDistance(appeared.index, disappeared.index);
          if (moveDistance < shortestDistance) {
            foundMoved = disappeared;
            shortestDistance = moveDistance;
          }
        }
      });
      if (foundMoved) {
        disappearedList.splice(disappearedList.indexOf(foundMoved), 1);
        changes.push({
          type: CHANGE_TYPE.move,
          piece: appeared.piece,
          atIndex: foundMoved.index,
          toIndex: appeared.index
        });
      } else {
        changes.push({ type: CHANGE_TYPE.appear, piece: appeared.piece, atIndex: appeared.index });
      }
    });
    disappearedList.forEach((disappeared) => {
      changes.push({ type: CHANGE_TYPE.disappear, piece: disappeared.piece, atIndex: disappeared.index });
    });
    return changes;
  }
  createAnimation(fromSquares, toSquares) {
    const changes = _PositionsAnimation.seekChanges(fromSquares, toSquares);
    const animatedElements = [];
    changes.forEach((change) => {
      const animatedItem = {
        type: change.type
      };
      switch (change.type) {
        case CHANGE_TYPE.move:
          animatedItem.element = this.view.getPieceElement(Position.indexToSquare(change.atIndex));
          animatedItem.element.parentNode.appendChild(animatedItem.element);
          animatedItem.atPoint = this.view.indexToPoint(change.atIndex);
          animatedItem.toPoint = this.view.indexToPoint(change.toIndex);
          break;
        case CHANGE_TYPE.appear:
          animatedItem.element = this.view.drawPieceOnSquare(Position.indexToSquare(change.atIndex), change.piece);
          animatedItem.element.style.opacity = 0;
          break;
        case CHANGE_TYPE.disappear:
          animatedItem.element = this.view.getPieceElement(Position.indexToSquare(change.atIndex));
          break;
      }
      animatedElements.push(animatedItem);
    });
    return animatedElements;
  }
  animationStep(time) {
    if (!this.view || !this.view.chessboard.state) {
      return;
    }
    if (!this.startTime) {
      this.startTime = time;
    }
    const timeDiff = time - this.startTime;
    if (timeDiff <= this.duration) {
      this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
    } else {
      cancelAnimationFrame(this.frameHandle);
      this.animatedElements.forEach((animatedItem) => {
        if (animatedItem.type === CHANGE_TYPE.disappear) {
          Svg.removeElement(animatedItem.element);
        }
      });
      this.view.positionsAnimationTask.resolve();
      this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
        type: ANIMATION_EVENT_TYPE.end
      });
      this.callback();
      return;
    }
    const t = Math.min(1, timeDiff / this.duration);
    let progress = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    if (isNaN(progress) || progress > 0.99) {
      progress = 1;
    }
    this.animatedElements.forEach((animatedItem) => {
      if (animatedItem.element) {
        switch (animatedItem.type) {
          case CHANGE_TYPE.move:
            animatedItem.element.transform.baseVal.removeItem(0);
            const transform = this.view.svg.createSVGTransform();
            transform.setTranslate(
              animatedItem.atPoint.x + (animatedItem.toPoint.x - animatedItem.atPoint.x) * progress,
              animatedItem.atPoint.y + (animatedItem.toPoint.y - animatedItem.atPoint.y) * progress
            );
            animatedItem.element.transform.baseVal.appendItem(transform);
            break;
          case CHANGE_TYPE.appear:
            animatedItem.element.style.opacity = Math.round(progress * 100) / 100;
            break;
          case CHANGE_TYPE.disappear:
            animatedItem.element.style.opacity = Math.round((1 - progress) * 100) / 100;
            break;
        }
      } else {
        console.warn("animatedItem has no element", animatedItem);
      }
    });
    this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
      type: ANIMATION_EVENT_TYPE.frame,
      progress
    });
  }
  static squareDistance(index1, index2) {
    const file1 = index1 % 8;
    const rank1 = Math.floor(index1 / 8);
    const file2 = index2 % 8;
    const rank2 = Math.floor(index2 / 8);
    return Math.max(Math.abs(rank2 - rank1), Math.abs(file2 - file1));
  }
};
var PositionAnimationsQueue = class extends PromiseQueue {
  constructor(chessboard) {
    super();
    this.chessboard = chessboard;
  }
  async enqueuePositionChange(positionFrom, positionTo, animated) {
    if (positionFrom.getFen() === positionTo.getFen()) {
      return Promise.resolve();
    } else {
      return super.enqueue(() => new Promise((resolve) => {
        let duration = animated ? this.chessboard.props.style.animationDuration : 0;
        if (this.queue.length > 0) {
          duration = duration / (1 + Math.pow(this.queue.length / 5, 2));
        }
        new PositionsAnimation(
          this.chessboard.view,
          positionFrom,
          positionTo,
          animated ? duration : 0,
          () => {
            if (this.chessboard.view) {
              this.chessboard.view.redrawPieces(positionTo.squares);
            }
            resolve();
          }
        );
      }));
    }
  }
  async enqueueTurnBoard(position, color, animated) {
    return super.enqueue(() => new Promise((resolve) => {
      const emptyPosition = new Position(FEN.empty);
      let duration = animated ? this.chessboard.props.style.animationDuration : 0;
      if (this.queue.length > 0) {
        duration = duration / (1 + Math.pow(this.queue.length / 5, 2));
      }
      new PositionsAnimation(
        this.chessboard.view,
        position,
        emptyPosition,
        animated ? duration : 0,
        () => {
          this.chessboard.state.orientation = color;
          this.chessboard.view.redrawBoard();
          this.chessboard.view.redrawPieces(emptyPosition.squares);
          new PositionsAnimation(
            this.chessboard.view,
            emptyPosition,
            position,
            animated ? duration : 0,
            () => {
              this.chessboard.view.redrawPieces(position.squares);
              resolve();
            }
          );
        }
      );
    }));
  }
};

// node_modules/cm-chessboard/src/view/VisualMoveInput.js
var MOVE_INPUT_STATE = {
  waitForInputStart: "waitForInputStart",
  pieceClickedThreshold: "pieceClickedThreshold",
  clickTo: "clickTo",
  secondClickThreshold: "secondClickThreshold",
  dragTo: "dragTo",
  clickDragTo: "clickDragTo",
  moveDone: "moveDone",
  reset: "reset"
};
var MOVE_CANCELED_REASON = {
  secondClick: "secondClick",
  // clicked the same piece
  secondaryClick: "secondaryClick",
  // right click while moving
  movedOutOfBoard: "movedOutOfBoard",
  draggedBack: "draggedBack",
  // dragged to the start square
  clickedAnotherPiece: "clickedAnotherPiece"
  // of the same color
};
var DRAG_THRESHOLD = 4;
var VisualMoveInput = class {
  constructor(view) {
    this.view = view;
    this.chessboard = view.chessboard;
    this.moveInputState = null;
    this.fromSquare = null;
    this.toSquare = null;
    this.setMoveInputState(MOVE_INPUT_STATE.waitForInputStart);
  }
  moveInputStartedCallback(square) {
    const result = this.view.moveInputStartedCallback(square);
    if (result) {
      this.chessboard.state.moveInputProcess = Utils.createTask();
      this.chessboard.state.moveInputProcess.then((result2) => {
        if (this.moveInputState === MOVE_INPUT_STATE.waitForInputStart || this.moveInputState === MOVE_INPUT_STATE.moveDone) {
          this.view.moveInputFinishedCallback(this.fromSquare, this.toSquare, result2);
        }
      });
    }
    return result;
  }
  movingOverSquareCallback(fromSquare, toSquare) {
    this.view.movingOverSquareCallback(fromSquare, toSquare);
  }
  validateMoveInputCallback(fromSquare, toSquare) {
    const result = this.view.validateMoveInputCallback(fromSquare, toSquare);
    this.chessboard.state.moveInputProcess.resolve(result);
    return result;
  }
  moveInputCanceledCallback(fromSquare, toSquare, reason) {
    this.view.moveInputCanceledCallback(fromSquare, toSquare, reason);
    this.chessboard.state.moveInputProcess.resolve();
  }
  setMoveInputState(newState, params = void 0) {
    const prevState = this.moveInputState;
    this.moveInputState = newState;
    switch (newState) {
      case MOVE_INPUT_STATE.waitForInputStart:
        break;
      case MOVE_INPUT_STATE.pieceClickedThreshold:
        if (MOVE_INPUT_STATE.waitForInputStart !== prevState && MOVE_INPUT_STATE.clickTo !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.pointerMoveListener) {
          removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
          this.pointerMoveListener = null;
        }
        if (this.pointerUpListener) {
          removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
          this.pointerUpListener = null;
        }
        this.fromSquare = params.square;
        this.toSquare = null;
        this.movedPiece = params.piece;
        this.startPoint = params.point;
        if (!this.pointerMoveListener && !this.pointerUpListener) {
          if (params.type === "mousedown") {
            this.pointerMoveListener = this.onPointerMove.bind(this);
            this.pointerMoveListener.type = "mousemove";
            addEventListener("mousemove", this.pointerMoveListener);
            this.pointerUpListener = this.onPointerUp.bind(this);
            this.pointerUpListener.type = "mouseup";
            addEventListener("mouseup", this.pointerUpListener);
          } else if (params.type === "touchstart") {
            this.pointerMoveListener = this.onPointerMove.bind(this);
            this.pointerMoveListener.type = "touchmove";
            addEventListener("touchmove", this.pointerMoveListener);
            this.pointerUpListener = this.onPointerUp.bind(this);
            this.pointerUpListener.type = "touchend";
            addEventListener("touchend", this.pointerUpListener);
          } else {
            throw Error("4b74af");
          }
          if (!this.contextMenuListener) {
            this.contextMenuListener = this.onContextMenu.bind(this);
            this.chessboard.view.svg.addEventListener("contextmenu", this.contextMenuListener);
          }
        } else {
          throw Error("94ad0c");
        }
        break;
      case MOVE_INPUT_STATE.clickTo:
        if (this.draggablePiece) {
          Svg.removeElement(this.draggablePiece);
          this.draggablePiece = null;
        }
        if (prevState === MOVE_INPUT_STATE.dragTo) {
          this.view.setPieceVisibility(params.square, true);
        }
        break;
      case MOVE_INPUT_STATE.secondClickThreshold:
        if (MOVE_INPUT_STATE.clickTo !== prevState) {
          throw new Error("moveInputState");
        }
        this.startPoint = params.point;
        break;
      case MOVE_INPUT_STATE.dragTo:
        if (MOVE_INPUT_STATE.pieceClickedThreshold !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.view.setPieceVisibility(params.square, false);
          this.createDraggablePiece(params.piece);
        }
        break;
      case MOVE_INPUT_STATE.clickDragTo:
        if (MOVE_INPUT_STATE.secondClickThreshold !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.view.setPieceVisibility(params.square, false);
          this.createDraggablePiece(params.piece);
        }
        break;
      case MOVE_INPUT_STATE.moveDone:
        if ([MOVE_INPUT_STATE.dragTo, MOVE_INPUT_STATE.clickTo, MOVE_INPUT_STATE.clickDragTo].indexOf(prevState) === -1) {
          throw new Error("moveInputState");
        }
        this.toSquare = params.square;
        if (this.toSquare && this.validateMoveInputCallback(this.fromSquare, this.toSquare)) {
          this.chessboard.movePiece(this.fromSquare, this.toSquare, prevState === MOVE_INPUT_STATE.clickTo).then(() => {
            if (prevState === MOVE_INPUT_STATE.clickTo) {
              this.view.setPieceVisibility(this.toSquare, true);
            }
            this.setMoveInputState(MOVE_INPUT_STATE.reset);
          });
        } else {
          this.view.setPieceVisibility(this.fromSquare, true);
          this.setMoveInputState(MOVE_INPUT_STATE.reset);
        }
        break;
      case MOVE_INPUT_STATE.reset:
        if (this.fromSquare && !this.toSquare && this.movedPiece) {
          this.chessboard.state.position.setPiece(this.fromSquare, this.movedPiece);
        }
        this.fromSquare = null;
        this.toSquare = null;
        this.movedPiece = null;
        if (this.draggablePiece) {
          Svg.removeElement(this.draggablePiece);
          this.draggablePiece = null;
        }
        if (this.pointerMoveListener) {
          removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
          this.pointerMoveListener = null;
        }
        if (this.pointerUpListener) {
          removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
          this.pointerUpListener = null;
        }
        if (this.contextMenuListener) {
          removeEventListener("contextmenu", this.contextMenuListener);
          this.contextMenuListener = null;
        }
        this.setMoveInputState(MOVE_INPUT_STATE.waitForInputStart);
        const hiddenPieces = this.view.piecesGroup.querySelectorAll("[visibility=hidden]");
        for (let i = 0; i < hiddenPieces.length; i++) {
          hiddenPieces[i].removeAttribute("visibility");
        }
        break;
      default:
        throw Error(`260b09: moveInputState ${newState}`);
    }
  }
  createDraggablePiece(pieceName) {
    if (this.draggablePiece) {
      throw Error("draggablePiece already exists");
    }
    this.draggablePiece = Svg.createSvg(document.body);
    this.draggablePiece.classList.add("cm-chessboard-draggable-piece");
    this.draggablePiece.setAttribute("width", this.view.squareWidth);
    this.draggablePiece.setAttribute("height", this.view.squareHeight);
    this.draggablePiece.setAttribute("style", "pointer-events: none");
    this.draggablePiece.name = pieceName;
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.view.getSpriteUrl();
    const piece = Svg.addElement(this.draggablePiece, "use", {
      href: `${spriteUrl}#${pieceName}`
    });
    const scaling = this.view.squareHeight / this.chessboard.props.style.pieces.tileSize;
    const transformScale = this.draggablePiece.createSVGTransform();
    transformScale.setScale(scaling, scaling);
    piece.transform.baseVal.appendItem(transformScale);
  }
  moveDraggablePiece(x, y) {
    this.draggablePiece.setAttribute(
      "style",
      `pointer-events: none; position: absolute; left: ${x - this.view.squareHeight / 2}px; top: ${y - this.view.squareHeight / 2}px`
    );
  }
  onPointerDown(e) {
    if (!(e.type === "mousedown" && e.button === 0 || e.type === "touchstart")) {
      return;
    }
    const square = e.target.getAttribute("data-square");
    if (!square) {
      return;
    }
    const pieceName = this.chessboard.getPiece(square);
    let color;
    if (pieceName) {
      color = pieceName ? pieceName.substring(0, 1) : null;
      if (color === "w" && this.chessboard.state.inputWhiteEnabled || color === "b" && this.chessboard.state.inputBlackEnabled) {
        e.preventDefault();
      }
    }
    if (this.moveInputState !== MOVE_INPUT_STATE.waitForInputStart || this.chessboard.state.inputWhiteEnabled && color === "w" || this.chessboard.state.inputBlackEnabled && color === "b") {
      let point;
      if (e.type === "mousedown") {
        point = { x: e.clientX, y: e.clientY };
      } else if (e.type === "touchstart") {
        point = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (this.moveInputState === MOVE_INPUT_STATE.waitForInputStart && pieceName && this.moveInputStartedCallback(square)) {
        this.setMoveInputState(MOVE_INPUT_STATE.pieceClickedThreshold, {
          square,
          piece: pieceName,
          point,
          type: e.type
        });
      } else if (this.moveInputState === MOVE_INPUT_STATE.clickTo) {
        if (square === this.fromSquare) {
          this.setMoveInputState(MOVE_INPUT_STATE.secondClickThreshold, {
            square,
            piece: pieceName,
            point,
            type: e.type
          });
        } else {
          const pieceName2 = this.chessboard.getPiece(square);
          const pieceColor = pieceName2 ? pieceName2.substring(0, 1) : null;
          const startPieceName = this.chessboard.getPiece(this.fromSquare);
          const startPieceColor = startPieceName ? startPieceName.substring(0, 1) : null;
          if (color && startPieceColor === pieceColor) {
            const result = this.validateMoveInputCallback(this.fromSquare, square);
            if (!result) {
              this.moveInputCanceledCallback(this.fromSquare, square, MOVE_CANCELED_REASON.clickedAnotherPiece);
              if (this.moveInputStartedCallback(square)) {
                this.setMoveInputState(MOVE_INPUT_STATE.pieceClickedThreshold, {
                  square,
                  piece: pieceName2,
                  point,
                  type: e.type
                });
              } else {
                this.setMoveInputState(MOVE_INPUT_STATE.reset);
              }
            }
          } else {
            this.setMoveInputState(MOVE_INPUT_STATE.moveDone, { square });
          }
        }
      }
    }
  }
  onPointerMove(e) {
    let pageX, pageY, clientX, clientY, target;
    if (e.type === "mousemove") {
      clientX = e.clientX;
      clientY = e.clientY;
      pageX = e.pageX;
      pageY = e.pageY;
      target = e.target;
    } else if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
      target = document.elementFromPoint(clientX, clientY);
    }
    if (this.moveInputState === MOVE_INPUT_STATE.pieceClickedThreshold || this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
      if (Math.abs(this.startPoint.x - clientX) > DRAG_THRESHOLD || Math.abs(this.startPoint.y - clientY) > DRAG_THRESHOLD) {
        if (this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.clickDragTo, {
            square: this.fromSquare,
            piece: this.movedPiece
          });
        } else {
          this.setMoveInputState(MOVE_INPUT_STATE.dragTo, { square: this.fromSquare, piece: this.movedPiece });
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.moveDraggablePiece(pageX, pageY);
        }
      }
    } else if (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo || this.moveInputState === MOVE_INPUT_STATE.clickTo) {
      if (target && target.getAttribute && target.parentElement === this.view.boardGroup) {
        const square = target.getAttribute("data-square");
        if (square !== this.fromSquare && square !== this.toSquare) {
          this.toSquare = square;
          this.movingOverSquareCallback(this.fromSquare, this.toSquare);
        } else if (square === this.fromSquare && this.toSquare !== null) {
          this.toSquare = null;
          this.movingOverSquareCallback(this.fromSquare, null);
        }
      } else if (this.toSquare !== null) {
        this.toSquare = null;
        this.movingOverSquareCallback(this.fromSquare, null);
      }
      if (this.view.chessboard.state.inputEnabled() && (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo)) {
        this.moveDraggablePiece(pageX, pageY);
      }
    }
  }
  onPointerUp(e) {
    let target;
    if (e.type === "mouseup") {
      target = e.target;
    } else if (e.type === "touchend") {
      target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    if (target && target.getAttribute) {
      const square = target.getAttribute("data-square");
      if (square) {
        if (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo) {
          if (this.fromSquare === square) {
            if (this.moveInputState === MOVE_INPUT_STATE.clickDragTo) {
              this.chessboard.state.position.setPiece(this.fromSquare, this.movedPiece);
              this.view.setPieceVisibility(this.fromSquare);
              this.moveInputCanceledCallback(square, null, MOVE_CANCELED_REASON.draggedBack);
              this.setMoveInputState(MOVE_INPUT_STATE.reset);
            } else {
              this.setMoveInputState(MOVE_INPUT_STATE.clickTo, { square });
            }
          } else {
            this.setMoveInputState(MOVE_INPUT_STATE.moveDone, { square });
          }
        } else if (this.moveInputState === MOVE_INPUT_STATE.pieceClickedThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.clickTo, { square });
        } else if (this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.reset);
          this.moveInputCanceledCallback(square, null, MOVE_CANCELED_REASON.secondClick);
        }
      } else {
        this.view.redrawPieces();
        const moveStartSquare = this.fromSquare;
        this.setMoveInputState(MOVE_INPUT_STATE.reset);
        this.moveInputCanceledCallback(moveStartSquare, null, MOVE_CANCELED_REASON.movedOutOfBoard);
      }
    } else {
      this.view.redrawPieces();
      this.setMoveInputState(MOVE_INPUT_STATE.reset);
    }
  }
  onContextMenu(e) {
    e.preventDefault();
    this.view.redrawPieces();
    this.setMoveInputState(MOVE_INPUT_STATE.reset);
    this.moveInputCanceledCallback(this.fromSquare, null, MOVE_CANCELED_REASON.secondaryClick);
  }
  isDragging() {
    return this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo;
  }
  destroy() {
    this.setMoveInputState(MOVE_INPUT_STATE.reset);
  }
};

// node_modules/cm-chessboard/src/view/ChessboardView.js
var COLOR = {
  white: "w",
  black: "b"
};
var INPUT_EVENT_TYPE = {
  moveInputStarted: "moveInputStarted",
  movingOverSquare: "movingOverSquare",
  // while dragging or hover after click
  validateMoveInput: "validateMoveInput",
  moveInputCanceled: "moveInputCanceled",
  moveInputFinished: "moveInputFinished"
};
var POINTER_EVENTS = {
  pointercancel: "pointercancel",
  pointerdown: "pointerdown",
  pointerenter: "pointerenter",
  pointerleave: "pointerleave",
  pointermove: "pointermove",
  pointerout: "pointerout",
  pointerover: "pointerover",
  pointerup: "pointerup"
};
var BORDER_TYPE = {
  none: "none",
  // no border
  thin: "thin",
  // thin border
  frame: "frame"
  // wide border with coordinates in it
};
var ChessboardView = class {
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.visualMoveInput = new VisualMoveInput(this);
    if (chessboard.props.assetsCache) {
      this.cacheSpriteToDiv("cm-chessboard-sprite", this.getSpriteUrl());
    }
    this.container = document.createElement("div");
    this.chessboard.context.appendChild(this.container);
    if (chessboard.props.responsive) {
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => {
          setTimeout(() => {
            this.handleResize();
          });
        });
        this.resizeObserver.observe(this.chessboard.context);
      } else {
        this.resizeListener = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeListener);
      }
    }
    this.positionsAnimationTask = Promise.resolve();
    this.pointerDownListener = this.pointerDownHandler.bind(this);
    this.container.addEventListener("mousedown", this.pointerDownListener);
    this.container.addEventListener("touchstart", this.pointerDownListener, { passive: false });
    this.createSvgAndGroups();
    this.handleResize();
  }
  pointerDownHandler(e) {
    this.visualMoveInput.onPointerDown(e);
  }
  destroy() {
    this.visualMoveInput.destroy();
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.chessboard.context);
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }
    this.chessboard.context.removeEventListener("mousedown", this.pointerDownListener);
    this.chessboard.context.removeEventListener("touchstart", this.pointerDownListener);
    Svg.removeElement(this.svg);
    this.container.remove();
  }
  // Sprite //
  cacheSpriteToDiv(wrapperId, url) {
    if (!document.getElementById(wrapperId)) {
      const wrapper = document.createElement("div");
      wrapper.style.transform = "scale(0)";
      wrapper.style.position = "absolute";
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.id = wrapperId;
      document.body.appendChild(wrapper);
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function() {
        wrapper.insertAdjacentHTML("afterbegin", xhr.response);
      };
      xhr.send();
    }
  }
  createSvgAndGroups() {
    this.svg = Svg.createSvg(this.container);
    let cssClass = this.chessboard.props.style.cssClass ? this.chessboard.props.style.cssClass : "default";
    this.svg.setAttribute("class", "cm-chessboard border-type-" + this.chessboard.props.style.borderType + " " + cssClass);
    this.svg.setAttribute("role", "img");
    this.updateMetrics();
    this.boardGroup = Svg.addElement(this.svg, "g", { class: "board" });
    this.coordinatesGroup = Svg.addElement(this.svg, "g", { class: "coordinates", "aria-hidden": "true" });
    this.markersLayer = Svg.addElement(this.svg, "g", { class: "markers-layer" });
    this.piecesLayer = Svg.addElement(this.svg, "g", { class: "pieces-layer" });
    this.piecesGroup = Svg.addElement(this.piecesLayer, "g", { class: "pieces" });
    this.markersTopLayer = Svg.addElement(this.svg, "g", { class: "markers-top-layer" });
    this.interactiveTopLayer = Svg.addElement(this.svg, "g", { class: "interactive-top-layer" });
  }
  updateMetrics() {
    const piecesTileSize = this.chessboard.props.style.pieces.tileSize;
    this.width = this.container.clientWidth;
    this.height = this.container.clientWidth * (this.chessboard.props.style.aspectRatio || 1);
    if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
      this.borderSize = this.width / 25;
    } else if (this.chessboard.props.style.borderType === BORDER_TYPE.thin) {
      this.borderSize = this.width / 320;
    } else {
      this.borderSize = 0;
    }
    this.innerWidth = this.width - 2 * this.borderSize;
    this.innerHeight = this.height - 2 * this.borderSize;
    this.squareWidth = this.innerWidth / 8;
    this.squareHeight = this.innerHeight / 8;
    this.scalingX = this.squareWidth / piecesTileSize;
    this.scalingY = this.squareHeight / piecesTileSize;
    this.pieceXTranslate = this.squareWidth / 2 - piecesTileSize * this.scalingY / 2;
  }
  handleResize() {
    this.container.style.width = this.chessboard.context.clientWidth + "px";
    this.container.style.height = this.chessboard.context.clientWidth * this.chessboard.props.style.aspectRatio + "px";
    if (this.container.clientWidth !== this.width || this.container.clientHeight !== this.height) {
      this.updateMetrics();
      this.redrawBoard();
      this.redrawPieces();
    }
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
  }
  redrawBoard() {
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.beforeRedrawBoard);
    this.redrawSquares();
    this.drawCoordinates();
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.afterRedrawBoard);
    this.visualizeInputState();
  }
  // Board //
  redrawSquares() {
    while (this.boardGroup.firstChild) {
      this.boardGroup.removeChild(this.boardGroup.lastChild);
    }
    let boardBorder = Svg.addElement(this.boardGroup, "rect", { width: this.width, height: this.height });
    boardBorder.setAttribute("class", "border");
    if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
      const innerPos = this.borderSize;
      let borderInner = Svg.addElement(this.boardGroup, "rect", {
        x: innerPos,
        y: innerPos,
        width: this.width - innerPos * 2,
        height: this.height - innerPos * 2
      });
      borderInner.setAttribute("class", "border-inner");
    }
    for (let i = 0; i < 64; i++) {
      const index = this.chessboard.state.orientation === COLOR.white ? i : 63 - i;
      const squareColor = (9 * index & 8) === 0 ? "black" : "white";
      const fieldClass = `square ${squareColor}`;
      const point = this.squareToPoint(Position.indexToSquare(index));
      const squareRect = Svg.addElement(this.boardGroup, "rect", {
        x: point.x,
        y: point.y,
        width: this.squareWidth,
        height: this.squareHeight
      });
      squareRect.setAttribute("class", fieldClass);
      squareRect.setAttribute("data-square", Position.indexToSquare(index));
    }
  }
  drawCoordinates() {
    if (!this.chessboard.props.style.showCoordinates) {
      return;
    }
    while (this.coordinatesGroup.firstChild) {
      this.coordinatesGroup.removeChild(this.coordinatesGroup.lastChild);
    }
    const inline = this.chessboard.props.style.borderType !== BORDER_TYPE.frame;
    for (let file = 0; file < 8; file++) {
      let x = this.borderSize + (17 + this.chessboard.props.style.pieces.tileSize * file) * this.scalingX;
      let y = this.height - this.scalingY * 3.5;
      let cssClass = "coordinate file";
      if (inline) {
        x = x + this.scalingX * 15.5;
        cssClass += file % 2 ? " white" : " black";
      }
      const textElement = Svg.addElement(this.coordinatesGroup, "text", {
        class: cssClass,
        x,
        y,
        style: `font-size: ${this.scalingY * 10}px`
      });
      if (this.chessboard.state.orientation === COLOR.white) {
        textElement.textContent = String.fromCharCode(97 + file);
      } else {
        textElement.textContent = String.fromCharCode(104 - file);
      }
    }
    for (let rank = 0; rank < 8; rank++) {
      let x = this.borderSize / 3.7;
      let y = this.borderSize + 25 * this.scalingY + rank * this.squareHeight;
      let cssClass = "coordinate rank";
      if (inline) {
        cssClass += rank % 2 ? " black" : " white";
        if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
          x = x + this.scalingX * 10;
          y = y - this.scalingY * 15;
        } else {
          x = x + this.scalingX * 2;
          y = y - this.scalingY * 15;
        }
      }
      const textElement = Svg.addElement(this.coordinatesGroup, "text", {
        class: cssClass,
        x,
        y,
        style: `font-size: ${this.scalingY * 10}px`
      });
      if (this.chessboard.state.orientation === COLOR.white) {
        textElement.textContent = "" + (8 - rank);
      } else {
        textElement.textContent = "" + (1 + rank);
      }
    }
  }
  // Pieces //
  redrawPieces(squares = this.chessboard.state.position.squares) {
    const childNodes = Array.from(this.piecesGroup.childNodes);
    const isDragging = this.visualMoveInput.isDragging();
    for (let i = 0; i < 64; i++) {
      const pieceName = squares[i];
      if (pieceName) {
        const square = Position.indexToSquare(i);
        this.drawPieceOnSquare(square, pieceName, isDragging && square === this.visualMoveInput.fromSquare);
      }
    }
    for (const childNode of childNodes) {
      this.piecesGroup.removeChild(childNode);
    }
  }
  drawPiece(parentGroup, pieceName, point) {
    const pieceGroup = Svg.addElement(parentGroup, "g", {});
    pieceGroup.setAttribute("data-piece", pieceName);
    const transform = this.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    pieceGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const pieceUse = Svg.addElement(pieceGroup, "use", {
      href: `${spriteUrl}#${pieceName}`,
      class: "piece"
    });
    const transformScale = this.svg.createSVGTransform();
    transformScale.setScale(this.scalingY, this.scalingY);
    pieceUse.transform.baseVal.appendItem(transformScale);
    return pieceGroup;
  }
  drawPieceOnSquare(square, pieceName, hidden = false) {
    const pieceGroup = Svg.addElement(this.piecesGroup, "g", {});
    pieceGroup.setAttribute("data-piece", pieceName);
    pieceGroup.setAttribute("data-square", square);
    if (hidden) {
      pieceGroup.setAttribute("visibility", "hidden");
    }
    const point = this.squareToPoint(square);
    const transform = this.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    pieceGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const pieceUse = Svg.addElement(pieceGroup, "use", {
      href: `${spriteUrl}#${pieceName}`,
      class: "piece"
    });
    const transformTranslate = this.svg.createSVGTransform();
    transformTranslate.setTranslate(this.pieceXTranslate, 0);
    pieceUse.transform.baseVal.appendItem(transformTranslate);
    const transformScale = this.svg.createSVGTransform();
    transformScale.setScale(this.scalingY, this.scalingY);
    pieceUse.transform.baseVal.appendItem(transformScale);
    return pieceGroup;
  }
  setPieceVisibility(square, visible = true) {
    const piece = this.getPieceElement(square);
    if (piece) {
      if (visible) {
        piece.setAttribute("visibility", "visible");
      } else {
        piece.setAttribute("visibility", "hidden");
      }
    } else {
      console.warn("no piece on", square);
    }
  }
  getPieceElement(square) {
    if (!square || square.length < 2) {
      console.warn("invalid square", square);
      return null;
    }
    const piece = this.piecesGroup.querySelector(`g[data-square='${square}']`);
    if (!piece) {
      console.warn("no piece on", square);
      return null;
    }
    return piece;
  }
  // enable and disable move input //
  enableMoveInput(eventHandler, color = null) {
    if (this.chessboard.state.moveInputCallback) {
      throw Error("moveInput already enabled");
    }
    if (color === COLOR.white) {
      this.chessboard.state.inputWhiteEnabled = true;
    } else if (color === COLOR.black) {
      this.chessboard.state.inputBlackEnabled = true;
    } else {
      this.chessboard.state.inputWhiteEnabled = true;
      this.chessboard.state.inputBlackEnabled = true;
    }
    this.chessboard.state.moveInputCallback = eventHandler;
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInputToggled, { enabled: true, color });
    this.visualizeInputState();
  }
  disableMoveInput() {
    this.chessboard.state.inputWhiteEnabled = false;
    this.chessboard.state.inputBlackEnabled = false;
    this.chessboard.state.moveInputCallback = null;
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInputToggled, { enabled: false });
    this.visualizeInputState();
  }
  // callbacks //
  moveInputStartedCallback(square) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputStarted,
      square,
      /** square is deprecated, use squareFrom (2023-05-22) */
      squareFrom: square,
      piece: this.chessboard.getPiece(square)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
    return data.moveInputCallbackResult;
  }
  movingOverSquareCallback(squareFrom, squareTo) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.movingOverSquare,
      squareFrom,
      squareTo,
      piece: this.chessboard.getPiece(squareFrom)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  validateMoveInputCallback(squareFrom, squareTo) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.validateMoveInput,
      squareFrom,
      squareTo,
      piece: this.chessboard.getPiece(squareFrom)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
    return data.moveInputCallbackResult;
  }
  moveInputCanceledCallback(squareFrom, squareTo, reason) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputCanceled,
      reason,
      squareFrom,
      squareTo
    };
    if (this.chessboard.state.moveInputCallback) {
      this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  moveInputFinishedCallback(squareFrom, squareTo, legalMove) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputFinished,
      squareFrom,
      squareTo,
      legalMove
    };
    if (this.chessboard.state.moveInputCallback) {
      this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  // Helpers //
  visualizeInputState() {
    if (this.chessboard.state) {
      if (this.chessboard.state.inputWhiteEnabled || this.chessboard.state.inputBlackEnabled) {
        this.boardGroup.setAttribute("class", "board input-enabled");
      } else {
        this.boardGroup.setAttribute("class", "board");
      }
    }
  }
  indexToPoint(index) {
    let x, y;
    if (this.chessboard.state.orientation === COLOR.white) {
      x = this.borderSize + index % 8 * this.squareWidth;
      y = this.borderSize + (7 - Math.floor(index / 8)) * this.squareHeight;
    } else {
      x = this.borderSize + (7 - index % 8) * this.squareWidth;
      y = this.borderSize + Math.floor(index / 8) * this.squareHeight;
    }
    return { x, y };
  }
  squareToPoint(square) {
    const index = Position.squareToIndex(square);
    return this.indexToPoint(index);
  }
  getSpriteUrl() {
    if (Utils.isAbsoluteUrl(this.chessboard.props.style.pieces.file)) {
      return this.chessboard.props.style.pieces.file;
    } else {
      return this.chessboard.props.assetsUrl + this.chessboard.props.style.pieces.file;
    }
  }
};

// node_modules/cm-chessboard/src/Chessboard.js
var PIECE = {
  wp: "wp",
  wb: "wb",
  wn: "wn",
  wr: "wr",
  wq: "wq",
  wk: "wk",
  bp: "bp",
  bb: "bb",
  bn: "bn",
  br: "br",
  bq: "bq",
  bk: "bk"
};
var PIECE_TYPE = {
  pawn: "p",
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
  king: "k"
};
var PIECES_FILE_TYPE = {
  svgSprite: "svgSprite"
};
var Chessboard = class {
  constructor(context, props = {}) {
    if (!context) {
      throw new Error("container element is " + context);
    }
    this.context = context;
    this.id = (Math.random() + 1).toString(36).substring(2, 8);
    this.extensions = [];
    this.props = {
      position: FEN.empty,
      // set position as fen, use FEN.start or FEN.empty as shortcuts
      orientation: COLOR.white,
      // white on bottom
      responsive: true,
      // resize the board automatically to the size of the context element
      assetsUrl: "./assets/",
      // put all css and sprites in this folder, will be ignored for absolute urls of assets files
      assetsCache: true,
      // cache the sprites, deactivate if you want to use multiple pieces sets in one page
      style: {
        cssClass: "default",
        // set the css theme of the board, try "green", "blue" or "chess-club"
        showCoordinates: true,
        // show ranks and files
        borderType: BORDER_TYPE.none,
        // "thin" thin border, "frame" wide border with coordinates in it, "none" no border
        aspectRatio: 1,
        // height/width of the board
        pieces: {
          type: PIECES_FILE_TYPE.svgSprite,
          // pieces are in an SVG sprite, no other type supported for now
          file: "pieces/standard.svg",
          // the filename of the sprite in `assets/pieces/` or an absolute url like `https://…` or `/…`
          tileSize: 40
          // the tile size in the sprite
        },
        animationDuration: 300
        // pieces animation duration in milliseconds. Disable all animations with `0`
      },
      extensions: [
        /* {class: ExtensionClass, props: { ... }} */
      ]
      // add extensions here
    };
    Utils.mergeObjects(this.props, props);
    this.state = new ChessboardState();
    this.view = new ChessboardView(this);
    this.positionAnimationsQueue = new PositionAnimationsQueue(this);
    this.state.orientation = this.props.orientation;
    for (const extensionData of this.props.extensions) {
      this.addExtension(extensionData.class, extensionData.props);
    }
    this.view.redrawBoard();
    this.state.position = new Position(this.props.position);
    this.view.redrawPieces();
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    this.initialized = Promise.resolve();
  }
  // API //
  async setPiece(square, piece, animated = false) {
    const positionFrom = this.state.position.clone();
    this.state.position.setPiece(square, piece);
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async movePiece(squareFrom, squareTo, animated = false) {
    const positionFrom = this.state.position.clone();
    this.state.position.movePiece(squareFrom, squareTo);
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async setPosition(fen, animated = false) {
    const positionFrom = this.state.position.clone();
    const positionTo = new Position(fen);
    if (positionFrom.getFen() !== positionTo.getFen()) {
      this.state.position.setFen(fen);
      this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    }
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async setOrientation(color, animated = false) {
    const position = this.state.position.clone();
    if (this.boardTurning) {
      console.warn("setOrientation is only once in queue allowed");
      return;
    }
    this.boardTurning = true;
    return this.positionAnimationsQueue.enqueueTurnBoard(position, color, animated).then(() => {
      this.boardTurning = false;
      this.state.invokeExtensionPoints(EXTENSION_POINT.boardChanged);
    });
  }
  getPiece(square) {
    return this.state.position.getPiece(square);
  }
  getPosition() {
    return this.state.position.getFen();
  }
  getOrientation() {
    return this.state.orientation;
  }
  enableMoveInput(eventHandler, color = void 0) {
    this.view.enableMoveInput(eventHandler, color);
  }
  disableMoveInput() {
    this.view.disableMoveInput();
  }
  isMoveInputEnabled() {
    return this.state.inputWhiteEnabled || this.state.inputBlackEnabled;
  }
  enableSquareSelect(eventType = POINTER_EVENTS.pointerdown, eventHandler) {
    if (!this.squareSelectListener) {
      this.squareSelectListener = function(e) {
        const square = e.target.getAttribute("data-square");
        eventHandler({
          eventType: e.type,
          event: e,
          chessboard: this,
          square
        });
      };
    }
    this.context.addEventListener(eventType, this.squareSelectListener);
    this.state.squareSelectEnabled = true;
    this.view.visualizeInputState();
  }
  disableSquareSelect(eventType) {
    this.context.removeEventListener(eventType, this.squareSelectListener);
    this.squareSelectListener = void 0;
    this.state.squareSelectEnabled = false;
    this.view.visualizeInputState();
  }
  isSquareSelectEnabled() {
    return this.state.squareSelectEnabled;
  }
  addExtension(extensionClass, props) {
    if (this.getExtension(extensionClass)) {
      throw Error('extension "' + extensionClass.name + '" already added');
    }
    this.extensions.push(new extensionClass(this, props));
  }
  getExtension(extensionClass) {
    for (const extension of this.extensions) {
      if (extension instanceof extensionClass) {
        return extension;
      }
    }
    return null;
  }
  destroy() {
    this.state.invokeExtensionPoints(EXTENSION_POINT.destroy);
    this.positionAnimationsQueue.destroy();
    this.view.destroy();
    this.view = void 0;
    this.state = void 0;
  }
};

export {
  FEN,
  COLOR,
  INPUT_EVENT_TYPE,
  POINTER_EVENTS,
  BORDER_TYPE,
  PIECE,
  PIECE_TYPE,
  PIECES_FILE_TYPE,
  Chessboard
};
//# sourceMappingURL=chunk-22FRA7I2.js.map
