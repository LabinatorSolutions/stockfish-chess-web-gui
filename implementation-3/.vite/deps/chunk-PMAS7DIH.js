import {
  DomUtils
} from "./chunk-TRKBLDR5.js";

// node_modules/cm-web-modules/src/app/Component.js
var Component = class {
  constructor(props = {}, state = {}) {
    this.props = props;
    this.state = state;
  }
};
var UiComponent = class extends Component {
  constructor(context, props = {}, state = {}) {
    super(props, state);
    this.context = context;
    this.actions = {};
  }
  /**
   * Searches for "data-event-listener" attributes in the HTML, and couples them with actions.
   * Tag Attributes:
   *  - `data-event-listener`: The event "click", "change",...
   *  - `data-action`: The action in this.actions, called on the event
   *  - `data-delegate`: Query selector, to delegate the event from a child element
   */
  addDataEventListeners(context = this.context) {
    const eventListenerElements = context.querySelectorAll("[data-event-listener]");
    if (this.props.debug) {
      console.log("eventListenerElements", context, eventListenerElements);
    }
    for (const eventListenerElement of eventListenerElements) {
      const eventName = eventListenerElement.dataset.eventListener;
      const action = eventListenerElement.dataset.action;
      const delegate = eventListenerElement.dataset.delegate;
      if (!this.actions[action]) {
        console.error(context, 'You have to add the action "' + action + '" to your component.');
      }
      if (delegate) {
        DomUtils.delegate(eventListenerElement, eventName, delegate, (target) => {
          if (this.props.debug) {
            console.log("delegate", action, target);
          }
          this.actions[action](target);
        });
      } else {
        if (this.props.debug) {
          console.log("addEventListener", eventName, action);
        }
        if (!this.actions[action]) {
          console.error("no action", '"' + action + '"', "is defined");
        } else {
          eventListenerElement.addEventListener(eventName, this.actions[action].bind(this));
        }
      }
    }
    return this;
  }
};

export {
  Component,
  UiComponent
};
//# sourceMappingURL=chunk-PMAS7DIH.js.map
