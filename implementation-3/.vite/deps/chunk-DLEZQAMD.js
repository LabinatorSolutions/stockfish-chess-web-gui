// node_modules/chess-console/src/ChessConsolePlayer.js
var ChessConsolePlayer = class {
  constructor(chessConsole, name) {
    this.chessConsole = chessConsole;
    this.name = name;
  }
  /**
   * Called, when the Console requests the next Move from a Player.
   * The Player should answer the moveRequest with a moveResponse.
   * The moveResponse then returns the move result, if no move result was returned, the move was not legal.
   * @param fen current position
   * @param moveResponse a callback function to call as the moveResponse. Parameter is an object,
   * containing 'from' and `to`. Example: `moveResult = moveResponse({from: "e2", to: "e4", promotion: null})`.
   */
  moveRequest(fen, moveResponse) {
  }
};

export {
  ChessConsolePlayer
};
//# sourceMappingURL=chunk-DLEZQAMD.js.map
