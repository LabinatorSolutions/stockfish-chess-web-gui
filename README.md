# Stockfish Chess Web GUI

![License](https://www.shieldcn.dev/github/license/LabinatorSolutions/stockfish-chess-web-gui.svg?variant=default&size=sm&mode=light&font=jetbrains-mono)
![Package mgr · Bun](https://www.shieldcn.dev/badge/Package_mgr-Bun-000000.svg?logo=bun&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Language · TypeScript](https://www.shieldcn.dev/badge/Language-TypeScript-3178C6.svg?logo=typescript&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Lint · Biome](https://www.shieldcn.dev/badge/Lint-Biome-60A5FA.svg?logo=biome&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Hosting · Netlify](https://www.shieldcn.dev/badge/Hosting-Netlify-00AD9F.svg?logo=netlify&variant=branded&size=sm&mode=light&font=jetbrains-mono)

A modern, responsive, and fully functional web-based chess application powered by the **Stockfish 18** engine.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Mission](#mission)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Development](#installation--development)
- [Configuration](#configuration)
- [Security Requirements](#security-requirements)
- [Development & Contribution](#development--contribution)
- [Credits](#credits)
- [License](#license)

---

## Overview

It is a web graphical user interface (GUI) for the Stockfish Chess engine. It allows you to play against one of the strongest chess engines in the world directly in your browser, with professional-grade analysis tools and a highly customizable interface.

---

## Live Demo

There's no hosted public demo right now. The app itself is free — Stockfish runs client-side as WebAssembly in your own browser, so we don't pay per-user compute costs. The blocker is bandwidth/hosting: a public demo draws uncontrolled traffic, and serving the app (plus WASM binaries and assets) at scale isn't free for us to host indefinitely.

Run it locally instead — see [Installation & Development](#installation--development) below, it takes two commands.

---

## Mission

Our mission is to develop a modern, responsive, free, and open-source web-based chess GUI that brings the power of Stockfish to everyone, anywhere, on any device.

---

## Features

- **Multi-Mode Gameplay**:
  - **vs. Stockfish (Engine)**: Play against the engine with customizable strength.
  - **Local PvP (Pass-and-Play)**: Two players on the same device.
  - **Side Swap**: Switch colors mid-game; the board flips and the engine takes over the other side instantly.
  - **Analysis Mode**: Infinite analysis for post-game review.

- **Board & Piece Customization**:
  - **12 Board Themes**: Brown Wood, Red Wine, Green Forest, Blue Sky, and more, optimized for eye comfort.
  - **Piece Sets**: Choose between Standard and Staunty sets.
  - **Persistent Settings**: Your preferences are automatically saved in local storage.

- **Advanced Analysis Tools**:
  - **Multi-threaded Analysis**: Leverage your CPU's power (requires COOP/COEP headers).
  - **Customizable Engine Parameters**: Adjust Skill Level (1-20), Elo Rating, Fixed Depth (1-36), and Thinking Time.
  - **Visual Aids**: Hint button for best-move visualization and a toggleable analysis arrow.
  - **Real-time Eval**: Display real-time evaluation and the top 2 Principal Variations (PVs).
  - **Annotations**: Right-click to draw arrows and markers on the board.

---

## Tech Stack

- **[Bun](https://bun.sh/)**: Fast runtime, package manager, and native bundler.
- **[Biome](https://biomejs.dev/)**: Ultra-fast linter and formatter.
- **[cm-chessboard](https://github.com/shaack/cm-chessboard)**: High-quality chessboard visualization.
- **[chess-console](https://github.com/shaack/chess-console)**: Robust game logic and state management.
- **Stockfish.js / [cm-engine-runner](https://github.com/shaack/cm-engine-runner)**: Seamless chess engine abstraction.
- **Bootstrap 5**: Responsive UI styling.

---

## Project Structure

```text
├── src/
│   ├── Config.js                # Core app and engine configuration
│   ├── CustomStockfishRunner.js # Engine communication layer
│   ├── StockfishAnalysis.js     # Analysis mode logic
│   ├── StockfishGameControl.js  # UI-to-engine bridge
│   ├── StockfishNewGameDialog.js# Game setup modal
│   ├── StockfishPlayer.js       # Engine move generation logic
│   ├── StockfishStateView.js    # Performance and evaluation UI
│   ├── main.js                  # App initialization
│   └── extensions/              # Extra features (e.g., Markers, Arrows)
├── server.js                    # Local dev server with security headers
├── index.html                   # Main entry point
└── assets/                      # Styles, sounds, and opening books
```

---

## Installation & Development

### 1. Install Dependencies

```bash
bun install
```

### 2. Start Development Server

```bash
bun run dev
```

Open `http://localhost:3000`. This runs the Bun bundler in watch mode and serves the app via `server.js` to ensure the required security headers are present.

### 3. Build for Production

```bash
bun run build
```

The optimized output will be in the `dist` directory.

---

## Configuration

Core constants and default settings are located in `src/Config.js`.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `DEFAULT_SKILL_LEVEL` | 20 | Engine strength (1-20) |
| `DEFAULT_DEPTH` | 16 | Default thinking depth |
| `WORKER_PATH` | `/engine/...js` | Path to the Stockfish Web Worker |
| `DEFAULT_THEME` | `brown-wood` | Initial board theme |

---

## Security Requirements

Stockfish 18 utilizes multi-threaded WebAssembly, which depends on **SharedArrayBuffer**. For security reasons (Spectre/Meltdown mitigation), modern browsers only enable this feature if the page is cross-origin isolated.

The following headers MUST be present in your hosting environment:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

If these headers are missing, the engine will either fail to initialize or fall back to a slower, single-threaded mode.

---

## Development & Contribution

We welcome contributions! Please feel free to open issues or submit pull requests.

Interested in more advanced chess tools? Check out our flagship app:
👉 **[BoldChess Web App](https://github.com/LabinatorSolutions/boldchess-web-app)**

---

## Credits

- **Stockfish**: [Official Engine](https://github.com/official-stockfish/Stockfish)
- **Stockfish.js**: [WASM Port](https://github.com/nmrugg/stockfish.js)
- **BoldChess**: [boldchess.com](https://boldchess.com/)
- **Labinator**: [labinator.com](https://labinator.com/)

---

## License

This project is licensed under the **GNU AGPLv3**. See the [LICENSE](LICENSE) file for details.

---

*Verified and maintained by [BoldChess.com](https://boldchess.com) | A project by [Labinator.com](https://labinator.com)*
