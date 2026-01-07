// node_modules/cm-chessboard/src/lib/Svg.js
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
var Svg = class {
  /**
   * create the Svg in the HTML DOM
   * @param containerElement
   * @returns {Element}
   */
  static createSvg(containerElement = void 0) {
    let svg = document.createElementNS(SVG_NAMESPACE, "svg");
    if (containerElement) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      containerElement.appendChild(svg);
    }
    return svg;
  }
  /**
   * Add an Element to an SVG DOM
   * @param parent
   * @param name
   * @param attributes
   * @returns {Element}
   */
  static addElement(parent, name, attributes = {}) {
    let element = document.createElementNS(SVG_NAMESPACE, name);
    if (name === "use") {
      attributes["xlink:href"] = attributes["href"];
    }
    for (let attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        if (attribute.indexOf(":") !== -1) {
          const value = attribute.split(":");
          element.setAttributeNS("http://www.w3.org/1999/" + value[0], value[1], attributes[attribute]);
        } else {
          element.setAttribute(attribute, attributes[attribute]);
        }
      }
    }
    parent.appendChild(element);
    return element;
  }
  /**
   * Remove an element from an SVG DOM
   * @param element
   */
  static removeElement(element) {
    if (!element) {
      console.warn("removeElement, element is", element);
      return;
    }
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    } else {
      console.warn(element, "without parentNode");
    }
  }
};

// node_modules/cm-chessboard/src/lib/Utils.js
var Utils = class _Utils {
  static delegate(element, eventName, selector, handler) {
    const eventListener = function(event) {
      let target = event.target;
      while (target && target !== this) {
        if (target.matches(selector)) {
          handler.call(target, event);
        }
        target = target.parentNode;
      }
    };
    element.addEventListener(eventName, eventListener);
    return {
      remove: function() {
        element.removeEventListener(eventName, eventListener);
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
        Object.assign(source[key], _Utils.mergeObjects(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
  static createDomElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
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
  static isAbsoluteUrl(url) {
    return url.indexOf("://") !== -1 || url.startsWith("/");
  }
};

export {
  Svg,
  Utils
};
//# sourceMappingURL=chunk-2NUPLSFN.js.map
