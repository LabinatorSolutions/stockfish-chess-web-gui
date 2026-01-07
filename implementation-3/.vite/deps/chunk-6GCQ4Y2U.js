// node_modules/cm-engine-runner/src/EngineRunner.js
var ENGINE_STATE = {
  LOADING: 1,
  LOADED: 2,
  READY: 3,
  THINKING: 4
};
var EngineRunner = class {
  constructor(props) {
    this.props = {
      debug: false,
      responseDelay: 1e3
      // https://www.reddit.com/r/ProgrammerHumor/comments/6xwely/from_the_apple_chess_engine_code/
      // https://opensource.apple.com/source/Chess/Chess-347/Sources/MBCEngine.mm.auto.html
    };
    Object.assign(this.props, props);
    this.engineState = ENGINE_STATE.LOADING;
    this.initialized = this.init();
    this.initialization = this.initialized;
  }
  init() {
    return Promise.reject("you have to implement `init()` in the EngineRunner");
  }
  calculateMove(fen, props = {}) {
  }
};

export {
  ENGINE_STATE,
  EngineRunner
};
//# sourceMappingURL=chunk-6GCQ4Y2U.js.map
