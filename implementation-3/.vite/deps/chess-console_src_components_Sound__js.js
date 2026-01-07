import {
  Component
} from "./chunk-PMAS7DIH.js";
import {
  CONSOLE_MESSAGE_TOPICS
} from "./chunk-YELVW5X7.js";
import "./chunk-6LVC5MS7.js";
import "./chunk-TRKBLDR5.js";
import "./chunk-RHYLFANV.js";
import "./chunk-XZ62UXQF.js";
import "./chunk-22FRA7I2.js";
import "./chunk-2NUPLSFN.js";
import "./chunk-WCRIPQW3.js";
import "./chunk-5KWTC5XK.js";

// node_modules/cm-web-modules/src/audio/Audio.js
var events = ["click", "touchstart", "touchend", "keydown", "mousedown", "mouseup", "dblclick"];
var audioProps = void 0;
window.cmAudioDebug = false;
var createAudioContext = (props) => {
  audioProps = {
    debug: false,
    ...props
  };
  window.cmAudioDebug = audioProps.debug;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (window.AudioContext) {
    if (audioProps.debug) {
      console.log("Web Audio API (AudioContext) supported by this browser");
    }
    window.cmAudioContext = new AudioContext();
  } else if (window.webkitAudioContext) {
    if (audioProps.debug) {
      console.log("Web Audio API (window.webkitAudioContext) supported by this browser");
    }
    window.cmAudioContext = new webkitAudioContext();
  } else {
    console.error("Web Audio API is not supported by this browser");
  }
  window.cmMainGainNode = window.cmAudioContext.createGain();
  window.cmMainGainNode.gain.value = 1;
  cmMainGainNode.connect(window.cmAudioContext.destination);
  addEventListeners();
};
var Audio = class {
  static context() {
    if (!window.cmAudioContext) {
      console.error("Audio.context() called before createAudioContext()");
    }
    return window.cmAudioContext;
  }
  static destination() {
    return window.cmMainGainNode;
  }
  static setGain(gain) {
    window.cmMainGainNode.gain.setValueAtTime(gain, window.cmAudioContext.currentTime);
  }
  static isEnabled() {
    return window.cmAudioContext.state === "running";
  }
  /*
      Adds an event listener to the audioContext object
      that listens for the "statechange" event. This event is triggered whenever the state of the AudioContext changes
      (e.g., from "suspended" to "running" or vice versa). The listener function will be called whenever this event occurs,
      allowing you to execute custom code in response to changes in the AudioContext state.
   */
  static addStateListener(listener) {
    window.cmAudioContext.addEventListener("statechange", listener);
  }
  /*
      can be called from the UI to resume the AudioContext after user interaction
   */
  static resumeAudioContext() {
    resumeAudioContext();
  }
};
function addEventListeners() {
  events.forEach((event) => {
    document.addEventListener(event, resumeAudioContext);
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      setTimeout(resumeAudioContext, 200);
    }
  });
}
function removeEventListeners() {
  events.forEach((event) => {
    document.removeEventListener(event, resumeAudioContext);
  });
}
function resumeAudioContext() {
  if (window.cmAudioContext) {
    if (window.cmAudioContext.state !== "running") {
      window.cmAudioContext.resume().then(() => {
        if (audioProps.debug) {
          console.log("AudioContext resumed successfully, state:", window.cmAudioContext.state);
        }
        removeEventListeners();
      }).catch((error) => {
        console.error("Failed to resume AudioContext:", error);
      });
    } else {
      console.warn("AudioContext already running");
      removeEventListeners();
    }
  } else {
    console.error("AudioContext not created");
  }
}

// node_modules/cm-web-modules/src/audio/Sample.js
var Sample = class {
  constructor(src, props = {}) {
    this.src = src;
    this.props = {
      gain: 1,
      startWithoutAudioContext: true
      // start to play, without enabled audio context
    };
    Object.assign(this.props, props);
    this.gainNode = Audio.context().createGain();
    this.setGain(this.props.gain);
    this.audioBuffer = null;
    this.load();
  }
  setGain(gain) {
    if (window.cmAudioDebug) {
      console.log("Sample.setGain", gain);
    }
    this.gainNode.gain.setValueAtTime(gain, Audio.context().currentTime);
  }
  play(when = void 0, offset = void 0, duration = void 0) {
    if (window.cmAudioDebug) {
      console.log("Sample.play", this.src, when, offset, duration);
    }
    if (this.props.startWithoutAudioContext || Audio.isEnabled()) {
      this.loading.then(() => {
        let source;
        source = this.createBufferSource();
        source.start(when, offset, duration);
      });
    }
  }
  createBufferSource() {
    const source = Audio.context().createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.gainNode);
    this.gainNode.connect(Audio.destination());
    return source;
  }
  load() {
    this.loading = new Promise(((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", this.src, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        Audio.context().decodeAudioData(request.response, (audioBuffer) => {
          this.audioBuffer = audioBuffer;
          resolve();
        }, () => {
          console.error("error loading sound", this.src);
          reject();
        });
      };
      request.send();
    }));
    return this.loading;
  }
};

// node_modules/cm-web-modules/src/audio/AudioSprite.js
var AudioSprite = class extends Sample {
  // noinspection JSCheckFunctionSignatures
  play(sliceName, when = 0) {
    this.playSlice(sliceName, when);
  }
  playSlice(sliceName, when = 0) {
    const slice = this.props.slices[sliceName];
    if (!slice) {
      throw new Error(`slice ${sliceName} not found in sprite`);
    }
    super.play(when, slice.offset, slice.duration);
  }
};

// node_modules/chess-console/src/components/Sound.js
var Sound = class extends Component {
  constructor(chessConsole, props) {
    super(props);
    createAudioContext();
    this.chessConsole = chessConsole;
    this.audioSprite = new AudioSprite(
      this.props.soundSpriteFile,
      {
        gain: 1,
        slices: {
          "game_start": { offset: 0, duration: 0.9 },
          "game_won": { offset: 0.9, duration: 1.8 },
          "game_lost": { offset: 2.7, duration: 0.9 },
          "game_draw": { offset: 9.45, duration: 1.35 },
          "check": { offset: 3.6, duration: 0.45 },
          "wrong_move": { offset: 4.05, duration: 0.45 },
          "move": { offset: 4.5, duration: 0.2 },
          "capture": { offset: 6.3, duration: 0.2 },
          "castle": { offset: 7.65, duration: 0.2 },
          "take_back": { offset: 8.1, duration: 0.12 },
          "promotion": { offset: 9, duration: 0.45 },
          "dialog": { offset: 10.8, duration: 0.45 }
        }
      }
    );
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.initGame, () => {
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.legalMove, (data) => {
      const chess = this.chessConsole.state.chess;
      const flags = data.moveResult.flags;
      if (flags.indexOf("p") !== -1) {
        this.play("promotion");
      } else if (flags.indexOf("c") !== -1) {
        this.play("capture");
      } else if (flags.indexOf("k") !== -1 || flags.indexOf("q") !== -1) {
        this.play("castle");
      } else {
        clearInterval(this.moveDebounced);
        this.moveDebounced = setTimeout(() => {
          this.play("move");
        }, 10);
      }
      if (chess.inCheck() || chess.inCheckmate()) {
        this.play("check");
      }
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.illegalMove, () => {
      this.play("wrong_move");
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveUndone, () => {
      this.play("take_back");
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.gameOver, (data) => {
      setTimeout(() => {
        if (!data.wonColor) {
          this.play("game_lost");
        } else {
          if (data.wonColor === this.chessConsole.props.playerColor) {
            this.play("game_won");
          } else {
            this.play("game_lost");
          }
        }
      }, 500);
    });
    chessConsole.sound = this;
  }
  play(soundName) {
    this.audioSprite.play(soundName);
  }
};
export {
  Sound
};
//# sourceMappingURL=chess-console_src_components_Sound__js.js.map
