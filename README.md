# Stockfish Chess Web GUI

![License](https://www.shieldcn.dev/github/license/LabinatorSolutions/stockfish-chess-web-gui.svg?variant=default&size=sm&mode=light&font=jetbrains-mono)
![Package mgr · Bun](https://www.shieldcn.dev/badge/Package_mgr-Bun-000000.svg?logo=bun&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Language · JavaScript](https://www.shieldcn.dev/badge/Language-JavaScript-F7DF1E.svg?logo=javascript&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Lint · Biome](https://www.shieldcn.dev/badge/Lint-Biome-60A5FA.svg?logo=biome&variant=branded&size=sm&mode=light&font=jetbrains-mono)
![Hosting · Netlify](https://www.shieldcn.dev/badge/Hosting-Netlify-00AD9F.svg?logo=netlify&variant=branded&size=sm&mode=light&font=jetbrains-mono)

A modern, responsive, and fully functional web-based chess application powered by the **Stockfish 19** engine.

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
│   ├── CustomStockfishRunner.js # Engine communication layer (UCI options, info-line parsing)
│   ├── GameImport.js            # FEN/PGN validation for Setup / Import
│   ├── StockfishAnalysis.js     # Analysis panel (second engine instance, MultiPV)
│   ├── StockfishGameControl.js  # Extra toolbar buttons
│   ├── StockfishNewGameDialog.js# Game setup modal
│   ├── StockfishPlayer.js       # Engine move generation logic
│   ├── StockfishStateView.js    # Engine status and evaluation UI
│   ├── main.js                  # App initialization and wiring
│   ├── *.test.js                # Unit tests (bun test)
│   └── extensions/              # RightClickAnnotator: right-click arrows and markers
├── public/                      # Copied to dist/ as-is (engine worker + .wasm, manifest, icons)
│   └── _headers                 # Security headers: the single source for Netlify and server.js
├── scripts/                     # Build steps: copy-assets, inject-static-tags
├── server.js                    # Local server for dist/ with security headers
├── headers.js                   # Reads public/_headers for server.js
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

Open `http://localhost:3737`. This runs the Bun bundler in watch mode and serves the app via `server.js` to ensure the required security headers are present. Set `PORT` to use another port, e.g. `PORT=4000 bun run dev`.

### 3. Build for Production

```bash
bun run build
bun run preview   # serve dist/ locally
```

The optimized output will be in the `dist` directory.

### 4. Checks

```bash
bun run lint        # Biome lint + format check (lint:fix to apply)
bun run typecheck   # tsc over the JS sources (checkJs)
bun run test        # unit tests
```

---

## Configuration

Core constants and default settings are located in `src/Config.js`.

| Setting | Default | Description |
| :--- | :--- | :--- |
| `NAME` | `Stockfish 19` | Engine display name; keep in sync with the worker file |
| `DEFAULT_SKILL_LEVEL` | 20 | Engine strength (1-20) |
| `DEFAULT_DEPTH` | 16 | Default thinking depth |
| `WORKER_PATH` | `/engine/...js` | Path to the Stockfish Web Worker |
| `DEFAULT_THEME` | `brown-wood` | Initial board theme |

---

## Security Requirements

Stockfish 19 utilizes multi-threaded WebAssembly, which depends on **SharedArrayBuffer**. For security reasons (Spectre/Meltdown mitigation), modern browsers only enable this feature if the page is cross-origin isolated.

The following headers MUST be present in your hosting environment:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

They are defined once, in `public/_headers` (with the Content Security Policy). Netlify and Cloudflare Pages read that file from `dist/`; `server.js` reads it too. On other hosts, set the same headers in the server config.

If these headers are missing, the engine will either fail to initialize or fall back to a slower, single-threaded mode. The bundled `coi-serviceworker.js` tries to add them client-side as a fallback.

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
