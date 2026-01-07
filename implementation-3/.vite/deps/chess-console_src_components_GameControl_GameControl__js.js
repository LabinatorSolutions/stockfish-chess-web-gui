import {
  COLOR
} from "./chunk-RHYLFANV.js";
import "./chunk-XZ62UXQF.js";

// node_modules/bootstrap-show-modal/src/ShowModal.js
var Modal = class {
  constructor(props) {
    this.props = {
      title: "",
      // the dialog title html
      body: "",
      // the dialog body html
      footer: "",
      // the dialog footer html (mainly used for buttons)
      modalClass: "fade",
      // Additional css for ".modal", "fade" for fade effect
      modalDialogClass: "",
      // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
      headerClass: "",
      // Additional css for ".modal-header"
      bodyClass: "",
      // Additional css for ".modal-body"
      footerClass: "",
      // Additional css for ".modal-footer"
      theme: void 0,
      // data-bs-theme
      options: {
        // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
        backdrop: "static"
        // disallow closing on click in the background
      },
      draggable: false,
      // make the dialog draggable
      // Events:
      onCreate: null,
      // Callback, called after the modal was created
      onShown: null,
      // Callback, called after the modal was shown and completely faded in
      onDispose: null,
      // Callback, called after the modal was disposed
      onSubmit: null
      // Callback of bootstrap.showConfirm(), called after yes or no was pressed
    };
    Object.assign(this.props, props);
    this.id = "bootstrap-show-modal-" + i;
    i++;
    this.show();
    if (this.props.onCreate) {
      this.props.onCreate(this);
    }
  }
  createContainerElement() {
    const self = this;
    this.element = document.createElement("div");
    this.element.id = this.id;
    let cssClass = "modal " + this.props.modalClass;
    if (this.props.theme === "dark") {
      cssClass += " text-light";
    }
    this.element.setAttribute("class", cssClass);
    this.element.setAttribute("tabindex", "-1");
    this.element.setAttribute("role", "dialog");
    this.element.setAttribute("aria-labelledby", this.id);
    if (this.props.theme) {
      this.element.setAttribute("data-bs-theme", this.props.theme);
    }
    this.element.innerHTML = `
<div class="modal-dialog ${this.props.modalDialogClass}" role="document">
    <div class="modal-content">
    <div class="modal-header ${this.props.headerClass}">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body ${this.props.bodyClass}"></div>
    <div class="modal-footer ${this.props.footerClass}"></div>
    </div>
</div>`;
    document.body.appendChild(this.element);
    this.titleElement = this.element.querySelector(".modal-title");
    this.bodyElement = this.element.querySelector(".modal-body");
    this.footerElement = this.element.querySelector(".modal-footer");
    this.element.addEventListener("hidden.bs.modal", function() {
      self.dispose();
    });
    this.element.addEventListener("shown.bs.modal", function() {
      if (self.props.onShown) {
        self.props.onShown(self);
      }
    });
  }
  show() {
    if (!this.element) {
      this.createContainerElement();
      if (this.props.options) {
        const modalInstance = new bootstrap.Modal(this.element, this.props.options);
        if (modalInstance) {
          modalInstance.show();
        }
      } else {
        const modalInstance = new bootstrap.Modal(this.element);
        if (modalInstance) {
          modalInstance.show();
        }
      }
    } else {
      const modalInstance = bootstrap.Modal.getInstance(this.element);
      if (modalInstance) {
        modalInstance.show();
      }
    }
    if (this.props.title) {
      this.titleElement.style.display = "";
      this.titleElement.innerHTML = this.props.title;
    } else {
      this.titleElement.style.display = "none";
    }
    if (this.props.body) {
      this.bodyElement.style.display = "";
      this.bodyElement.innerHTML = this.props.body;
    } else {
      this.bodyElement.style.display = "none";
    }
    if (this.props.footer) {
      this.footerElement.style.display = "";
      this.footerElement.innerHTML = this.props.footer;
    } else {
      this.footerElement.style.display = "none";
    }
  }
  hide() {
    const modalInstance = bootstrap.Modal.getInstance(this.element);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  dispose() {
    const modalInstance = bootstrap.Modal.getInstance(this.element);
    if (modalInstance) {
      modalInstance.dispose();
    }
    document.body.removeChild(this.element);
    if (this.props.onDispose) {
      this.props.onDispose(this);
    }
  }
};
var i = 0;
bootstrap.showModal = (props) => {
  if (props.buttons) {
    let footer = "";
    for (let key in props.buttons) {
      const buttonText = props.buttons[key];
      footer += `<button type="button" class="btn btn-primary" data-value="${key}" data-bs-dismiss="modal">${buttonText}</button>`;
    }
    props.footer = footer;
  }
  return new Modal(props);
};
bootstrap.showAlert = (props) => {
  props.buttons = { OK: "OK" };
  return bootstrap.showModal(props);
};
bootstrap.showConfirm = (props) => {
  props.footer = `<button class="btn btn-secondary btn-false btn-cancel">${props.textFalse}</button><button class="btn btn-primary btn-true">${props.textTrue}</button>`;
  props.onCreate = (modal) => {
    const modalInstance = bootstrap.Modal.getInstance(modal.element);
    modal.element.querySelector(".btn-false").addEventListener("click", function() {
      if (modalInstance) {
        modalInstance.hide();
      }
      modal.props.onSubmit(false, modal);
    });
    modal.element.querySelector(".btn-true").addEventListener("click", function() {
      if (modalInstance) {
        modalInstance.hide();
      }
      modal.props.onSubmit(true, modal);
    });
  };
  return bootstrap.showModal(props);
};

// node_modules/chess-console/src/components/GameControl/NewGameDialog.js
var NewGameDialog = class {
  constructor(module, props) {
    const i18n = module.i18n;
    i18n.load({
      de: {
        color: "Farbe",
        white: "Weiss",
        black: "Schwarz",
        auto: "automatisch"
      },
      en: {
        color: "Color",
        white: "White",
        black: "Black",
        auto: "automatically"
      }
    }).then(() => {
      const newGameColor = module.persistence.loadValue("newGameColor");
      props.modalClass = "fade";
      props.body = `<form class="form"><div class="form-group row">
                    <div class="col-3"><label for="color" class="col-form-label">${i18n.t("color")}</label></div>
                    <div class="col-9"><select id="color" class="form-select">
                        <option value="auto">${i18n.t("auto")}</option>
                        <option value="w" ${newGameColor === "w" ? "selected" : ""}>${i18n.t("white")}</option>
                        <option value="b" ${newGameColor === "b" ? "selected" : ""}>${i18n.t("black")}</option>
                    </select></div>
                </div></form>`;
      props.footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t("cancel")}</button>
            <button type="submit" class="btn btn-primary">${i18n.t("ok")}</button>`;
      props.onCreate = (modal) => {
        modal.element.querySelector("button[type='submit']").addEventListener("click", function(event) {
          event.preventDefault();
          const formElement = modal.element.querySelector(".form");
          let color = formElement.querySelector("#color").value;
          module.persistence.saveValue("newGameColor", color);
          if (color !== COLOR.white && color !== COLOR.black) {
            color = module.props.playerColor === COLOR.white ? COLOR.black : COLOR.white;
          }
          modal.hide();
          module.newGame({ playerColor: color });
        });
      };
      bootstrap.showModal(props);
    });
  }
};

// node_modules/chess-console/src/components/GameControl/GameControl.js
var GameControl = class {
  constructor(chessConsole, props) {
    this.context = chessConsole.componentContainers.controlButtons;
    this.chessConsole = chessConsole;
    this.props = props;
    const i18n = chessConsole.i18n;
    i18n.load({
      de: {
        "start_game": "Ein neues Spiel starten",
        "undo_move": "Zug zurück nehmen"
      },
      en: {
        "start_game": "Start a new game",
        "undo_move": "Undo move"
      }
    }).then(() => {
      this.$btnUndoMove = $(`<button type="button" title="${i18n.t("undo_move")}" class="btn btn-icon btn-light undoMove"><i class="fa fa-fw fa-undo-alt" aria-hidden="true"></i></button>`);
      this.$btnStartNewGame = $(`<button type="button" title="${i18n.t("start_game")}" class="btn btn-icon btn-light startNewGame"><i class="fa fa-fw fa-plus" aria-hidden="true"></i></button>\`)`);
      this.context.appendChild(this.$btnUndoMove[0]);
      this.context.appendChild(this.$btnStartNewGame[0]);
      this.$btnUndoMove.click(() => {
        this.chessConsole.undoMove();
      });
      this.$btnStartNewGame.click(() => {
        this.showNewGameDialog();
      });
      this.chessConsole.state.observeChess(() => {
        this.setButtonStates();
      });
      this.setButtonStates();
    });
  }
  showNewGameDialog() {
    new NewGameDialog(this.chessConsole, {
      title: this.chessConsole.i18n.t("start_game")
    });
  }
  setButtonStates() {
    if (this.chessConsole.state.chess.plyCount() < 2) {
      this.$btnUndoMove.prop("disabled", true);
    } else {
      this.$btnUndoMove.prop("disabled", false);
    }
  }
};
export {
  GameControl
};
//# sourceMappingURL=chess-console_src_components_GameControl_GameControl__js.js.map
