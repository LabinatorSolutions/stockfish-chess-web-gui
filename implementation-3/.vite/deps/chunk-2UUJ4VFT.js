import {
  INPUT_EVENT_TYPE
} from "./chunk-22FRA7I2.js";
import {
  Svg,
  Utils
} from "./chunk-2NUPLSFN.js";
import {
  EXTENSION_POINT,
  Extension
} from "./chunk-WCRIPQW3.js";

// node_modules/cm-chessboard/src/extensions/markers/Markers.js
var MARKER_TYPE = {
  frame: { class: "marker-frame", slice: "markerFrame" },
  framePrimary: { class: "marker-frame-primary", slice: "markerFrame" },
  frameDanger: { class: "marker-frame-danger", slice: "markerFrame" },
  circle: { class: "marker-circle", slice: "markerCircle" },
  circlePrimary: { class: "marker-circle-primary", slice: "markerCircle" },
  circleDanger: { class: "marker-circle-danger", slice: "markerCircle" },
  circleDangerFilled: { class: "marker-circle-danger-filled", slice: "markerCircleFilled" },
  square: { class: "marker-square", slice: "markerSquare" },
  dot: { class: "marker-dot", slice: "markerDot", position: "above" },
  bevel: { class: "marker-bevel", slice: "markerBevel" }
};
var Markers = class extends Extension {
  /** @constructor */
  constructor(chessboard, props = {}) {
    super(chessboard);
    this.registerExtensionPoint(EXTENSION_POINT.afterRedrawBoard, () => {
      this.onRedrawBoard();
    });
    this.props = {
      autoMarkers: MARKER_TYPE.frame,
      // set to `null` to disable autoMarkers
      sprite: "extensions/markers/markers.svg"
      // the sprite file of the markers
    };
    Object.assign(this.props, props);
    if (chessboard.props.assetsCache) {
      chessboard.view.cacheSpriteToDiv("cm-chessboard-markers", this.getSpriteUrl());
    }
    chessboard.addMarker = this.addMarker.bind(this);
    chessboard.getMarkers = this.getMarkers.bind(this);
    chessboard.removeMarkers = this.removeMarkers.bind(this);
    chessboard.addLegalMovesMarkers = this.addLegalMovesMarkers.bind(this);
    chessboard.removeLegalMovesMarkers = this.removeLegalMovesMarkers.bind(this);
    this.markerGroupDown = Svg.addElement(chessboard.view.markersLayer, "g", { class: "markers" });
    this.markerGroupUp = Svg.addElement(chessboard.view.markersTopLayer, "g", { class: "markers" });
    this.markers = [];
    if (this.props.autoMarkers) {
      Object.assign(this.props.autoMarkers, this.props.autoMarkers);
      this.registerExtensionPoint(EXTENSION_POINT.moveInput, (event) => {
        this.drawAutoMarkers(event);
      });
    }
  }
  drawAutoMarkers(event) {
    if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
      this.removeMarkers(this.props.autoMarkers);
    }
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted && !event.moveInputCallbackResult) {
      return;
    }
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted || event.type === INPUT_EVENT_TYPE.movingOverSquare) {
      if (event.squareFrom) {
        this.addMarker(this.props.autoMarkers, event.squareFrom);
      }
      if (event.squareTo) {
        this.addMarker(this.props.autoMarkers, event.squareTo);
      }
    }
  }
  onRedrawBoard() {
    while (this.markerGroupUp.firstChild) {
      this.markerGroupUp.removeChild(this.markerGroupUp.firstChild);
    }
    while (this.markerGroupDown.firstChild) {
      this.markerGroupDown.removeChild(this.markerGroupDown.firstChild);
    }
    this.markers.forEach(
      (marker) => {
        this.drawMarker(marker);
      }
    );
  }
  addLegalMovesMarkers(moves) {
    for (const move of moves) {
      if (move.promotion && move.promotion !== "q") {
        continue;
      }
      if (this.chessboard.getPiece(move.to)) {
        this.chessboard.addMarker(MARKER_TYPE.bevel, move.to);
      } else {
        this.chessboard.addMarker(MARKER_TYPE.dot, move.to);
      }
    }
  }
  removeLegalMovesMarkers() {
    this.chessboard.removeMarkers(MARKER_TYPE.bevel);
    this.chessboard.removeMarkers(MARKER_TYPE.dot);
  }
  drawMarker(marker) {
    let markerGroup;
    if (marker.type.position === "above") {
      markerGroup = Svg.addElement(this.markerGroupUp, "g");
    } else {
      markerGroup = Svg.addElement(this.markerGroupDown, "g");
    }
    markerGroup.setAttribute("data-square", marker.square);
    const point = this.chessboard.view.squareToPoint(marker.square);
    const transform = this.chessboard.view.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    markerGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const markerUse = Svg.addElement(
      markerGroup,
      "use",
      { href: `${spriteUrl}#${marker.type.slice}`, class: "marker " + marker.type.class }
    );
    const transformScale = this.chessboard.view.svg.createSVGTransform();
    transformScale.setScale(this.chessboard.view.scalingX, this.chessboard.view.scalingY);
    markerUse.transform.baseVal.appendItem(transformScale);
    return markerGroup;
  }
  addMarker(type, square) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `addMarker` to `(type, square)` with v5.1.x");
      return;
    }
    this.markers.push(new Marker(square, type));
    this.onRedrawBoard();
  }
  getMarkers(type = void 0, square = void 0) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `getMarkers` to `(type, square)` with v5.1.x");
      return;
    }
    let markersFound = [];
    this.markers.forEach((marker) => {
      if (marker.matches(square, type)) {
        markersFound.push(marker);
      }
    });
    return markersFound;
  }
  removeMarkers(type = void 0, square = void 0) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `removeMarkers` to `(type, square)` with v5.1.x");
      return;
    }
    this.markers = this.markers.filter((marker) => !marker.matches(square, type));
    this.onRedrawBoard();
  }
  getSpriteUrl() {
    if (Utils.isAbsoluteUrl(this.props.sprite)) {
      return this.props.sprite;
    } else {
      return this.chessboard.props.assetsUrl + this.props.sprite;
    }
  }
};
var Marker = class {
  constructor(square, type) {
    this.square = square;
    this.type = type;
  }
  matches(square = void 0, type = void 0) {
    if (!type && !square) {
      return true;
    } else if (!type) {
      if (square === this.square) {
        return true;
      }
    } else if (!square) {
      if (this.type === type) {
        return true;
      }
    } else if (this.type === type && square === this.square) {
      return true;
    }
    return false;
  }
};

export {
  MARKER_TYPE,
  Markers
};
//# sourceMappingURL=chunk-2UUJ4VFT.js.map
