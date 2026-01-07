import {
  ENGINE_STATE,
  EngineRunner
} from "./chunk-6GCQ4Y2U.js";

// node_modules/cm-engine-runner/src/StockfishRunner.js
var LEVELS = {
  1: [3, 0],
  2: [3, 1],
  3: [4, 2],
  4: [5, 3],
  5: [5, 4],
  6: [6, 5],
  7: [7, 6],
  8: [8, 7],
  9: [9, 8],
  10: [10, 10],
  11: [11, 11],
  12: [12, 12],
  13: [13, 13],
  14: [14, 14],
  15: [15, 15],
  16: [16, 16],
  17: [17, 17],
  18: [18, 18],
  19: [19, 19],
  20: [20, 20]
};
var StockfishRunner = class extends EngineRunner {
  constructor(props) {
    super(props);
  }
  init() {
    return new Promise((resolve) => {
      const listener = (event) => {
        this.workerListener(event);
      };
      if (this.engineWorker) {
        this.engineWorker.removeEventListener("message", listener);
        this.engineWorker.terminate();
      }
      this.engineWorker = new Worker(this.props.workerUrl);
      this.engineWorker.addEventListener("message", listener);
      this.uciCmd("uci");
      this.uciCmd("ucinewgame");
      this.uciCmd("isready");
      resolve();
    });
  }
  workerListener(event) {
    if (this.props.debug) {
      if (event.type === "message") {
        console.log("  msg", event.data);
      } else {
        console.log(event);
      }
    }
    const line = event.data;
    if (line === "uciok") {
      this.engineState = ENGINE_STATE.LOADED;
    } else if (line === "readyok") {
      this.engineState = ENGINE_STATE.READY;
    } else {
      let match = line.match(/^info .*\bscore (\w+) (-?\d+)/);
      if (match) {
        const score = parseInt(match[2], 10);
        let tmpScore;
        if (match[1] === "cp") {
          tmpScore = (score / 100).toFixed(1);
        } else if (match[1] === "mate") {
          tmpScore = "#" + Math.abs(score);
        }
        this.score = tmpScore;
      }
      match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?( ponder ([a-h][1-8])?([a-h][1-8])?)?/);
      if (match) {
        this.engineState = ENGINE_STATE.READY;
        if (match[4] !== void 0) {
          this.ponder = { from: match[5], to: match[6] };
        } else {
          this.ponder = void 0;
        }
        const move = { from: match[1], to: match[2], promotion: match[3], score: this.score, ponder: this.ponder };
        this.moveResponse(move);
      } else {
        match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/);
        if (match) {
          this.engineState = ENGINE_STATE.THINKING;
          this.search = "Depth: " + match[1] + " Nps: " + match[2];
        }
      }
    }
  }
  calculateMove(fen, props = { level: 4 }) {
    this.engineState = ENGINE_STATE.THINKING;
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(async () => {
        resolve();
      }, this.props.responseDelay);
    });
    const calculationPromise = new Promise((resolve) => {
      setTimeout(() => {
        this.uciCmd("setoption name Skill Level value " + LEVELS[props.level][1]);
        this.uciCmd("position fen " + fen);
        this.uciCmd("go depth " + LEVELS[props.level][0]);
        this.moveResponse = (move) => {
          resolve(move);
        };
      }, this.props.responseDelay);
    });
    return new Promise((resolve) => {
      Promise.all([this.initialisation, timeoutPromise, calculationPromise]).then((values) => {
        this.engineState = ENGINE_STATE.READY;
        resolve(values[2]);
      });
    });
  }
  uciCmd(cmd) {
    if (this.props.debug) {
      console.log("  uci ->", cmd);
    }
    this.engineWorker.postMessage(cmd);
  }
};
export {
  LEVELS,
  StockfishRunner
};
//# sourceMappingURL=cm-engine-runner_src_StockfishRunner__js.js.map
