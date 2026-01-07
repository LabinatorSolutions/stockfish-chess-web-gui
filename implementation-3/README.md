# Stockfish Web GUI - By BoldChess

A modern, responsive web-based GUI for the Stockfish chess engine, powered by `cm-chessboard`, `chess-console`, and `vite`.

## Features

-   **Stockfish 17+ Integration**: Runnable directly in the browser using WebAssembly.
-   **Advanced Analysis**:
    -   Multi-threaded analysis.
    -   Customizable **Skill Level** (1-20) and **Depth** (1-36).
    -   Right-click annotations (arrows and markers).
    -   Real-time evaluation and principal variation display.
-   **User-Friendly Interface**:
    -   Clean, responsive design using Bootstrap 5.
    -   "Clear Annotations" button for easy board cleanup.
    -   Automatic annotation clearing on legal moves.
    -   FEN string support for setting up custom positions.
-   **Save & Load**: Automatically saves game state and settings to local storage.

## Tech Stack

-   **Vite**: Fast development server and bundler.
-   **cm-chessboard**: Local chessboard visualization.
-   **chess-console**: Game logic and state management.
-   **Stockfish.js / cm-engine-runner**: Chess engine abstraction.
-   **Bootstrap 5**: UI styling.

## Installation & Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open your browser at `http://localhost:5173`.

3.  **Build for production:**
    ```bash
    npm run build
    ```
    The output will be in the `dist` directory.

## Configuration

Core configuration constants can be found in `src/Config.js`.

-   **Default Skill Level**: 20
-   **Default Depth**: 16
-   **Engine Path**: `/engine/`

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**. See the `LICENSE` file for details.

---

*Verified and maintained by BoldChess.com | This is a project by Labinator.com*
