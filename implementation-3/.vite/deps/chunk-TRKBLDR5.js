// node_modules/cm-web-modules/src/utils/DomUtils.js
var DomUtils = class _DomUtils {
  static onDocumentReady(callback) {
    this.documentReady(callback);
  }
  /** @deprecated 2023-05-31 use onDocumentReady() */
  static documentReady(callback) {
    document.addEventListener("DOMContentLoaded", callback);
    if (document.readyState === "interactive" || document.readyState === "complete") {
      document.removeEventListener("DOMContentLoaded", callback);
      callback();
    }
  }
  // todo test, if it works with document.body
  static onDomNodeRemoved(elementToWatch, callback, parent = document.querySelector("body")) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
          if (mutation.removedNodes.length > 0 && mutation.removedNodes[0] === elementToWatch) {
            callback(elementToWatch);
          }
        }
      });
    });
    observer.observe(parent, { childList: true });
  }
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  static isElementVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }
  // https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
  static isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  static getFormInputValues(context) {
    const inputs = context.querySelectorAll("input,select");
    const values = {};
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        values[input.id] = !!input.checked;
      } else {
        values[input.id] = input.value;
      }
    });
    return values;
  }
  static isBrowserDarkMode() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  static browserSupportsPreferredColorScheme() {
    return window.matchMedia && (window.matchMedia("(prefers-color-scheme: dark)").matches || window.matchMedia("(prefers-color-scheme: light)").matches);
  }
  static loadJs(src) {
    const element = document.createElement("script");
    element.setAttribute("type", "text/javascript");
    element.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(element);
  }
  static loadCss(src) {
    const element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", src);
    document.getElementsByTagName("head")[0].appendChild(element);
  }
  static setCustomProperty(name, value, element = document.documentElement) {
    element.style.setProperty("--" + name, value.trim());
  }
  static getCustomProperty(name, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue("--" + name).trim();
  }
  static createElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  static removeElement(element) {
    element.parentNode.removeChild(element);
  }
  static clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  static insertAfter(newChild, refChild) {
    refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
  }
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
  static isExternalLink(link) {
    return link.hostname !== window.location.hostname;
  }
  static openExternalLinksBlank(context = document) {
    const links = context.links;
    for (let i = 0; i < links.length; i++) {
      if (this.isExternalLink(links[i]) && links[i].target !== "_self") {
        links[i].target = "_blank";
      }
    }
  }
  static disableButtonsOnSubmit() {
    const buttons = document.querySelectorAll("button[data-disable-on-submit]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        button.setAttribute("disabled", "disabled");
      });
    });
  }
  /**
   * Searches for "data-event-listener" attributes in the HTML, and couples them with actions.
   * Tag Attributes:
   *  - `data-event-listener`: The event "click", "change",...
   *  - `data-action`: The action in this.actions, called on the event
   *  - `data-delegate`: Query selector, to delegate the event from a child element
   */
  static autoBindDataEvents(controller, props = {}) {
    const context = controller.context;
    const eventListenerElements = context.querySelectorAll("[data-event]");
    this.props = {
      debug: false,
      ...props
    };
    if (this.props.debug) {
      console.log("eventListenerElements", context, eventListenerElements);
    }
    for (const eventListenerElement of eventListenerElements) {
      const eventName = eventListenerElement.dataset.event;
      const action = eventListenerElement.dataset.action;
      const delegate = eventListenerElement.dataset.delegate;
      if (!action) {
        console.error("no action defined", eventListenerElement);
      }
      if (!controller.actions[action]) {
        console.error(context, 'You have to add the action "' + action + '" to your component.');
      }
      if (delegate) {
        _DomUtils.delegate(eventListenerElement, eventName, delegate, (target) => {
          if (this.props.debug) {
            console.log("delegate", action, target);
          }
          controller.actions[action](target);
        });
      } else {
        if (this.props.debug) {
          console.log("addEventListener", eventName, action);
        }
        if (!controller.actions[action]) {
          console.error("no action", '"' + action + '"', "is defined");
        } else {
          eventListenerElement.addEventListener(eventName, controller.actions[action].bind(controller));
        }
      }
    }
  }
};

export {
  DomUtils
};
//# sourceMappingURL=chunk-TRKBLDR5.js.map
