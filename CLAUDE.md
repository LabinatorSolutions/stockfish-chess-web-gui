# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Browser chess GUI for Stockfish (WASM, runs fully client-side). Plain JavaScript ES modules, no framework;
Bun is the runtime, package manager and bundler; Biome lints and formats; `tsc` type-checks the JS via
`checkJs`.

## Repo-specific Overrides

- **Git commit/push:** allowed for this repo (owner, 2026-10-03), commit and push both. Keep messages
  brief and add no `Co-Authored-By`, `Claude-Session` or other agent trailers.

## Commands

```bash
bun install
bun run dev          # bun build --watch into dist/ + copy-assets + server.js on http://localhost:3737
bun run build        # clean production build into dist/ (minify, copy-assets, inject-static-tags)
bun run preview      # serve an existing dist/ with server.js
bun run lint         # biome check .   (lint:fix to apply)
bun run ci           # biome ci . — same scope, no writes
bun run typecheck    # tsc --noEmit (src, scripts, server.js, headers.js)
bun run test         # bun test (src/*.test.js, headers.test.js)
bun test src/Config.test.js          # one file
bun test -t "parses a negative"      # tests matching a name
```

The PR template checklist is lint, typecheck, test, build, then manual browser verification. Netlify's
build runs `bun install && bun run lint && bun run test && bun run build` (not typecheck).

`server.js` serves `dist/`, not the source tree, so the app only runs after a build (or with `dev`
running). Engine features need the cross-origin isolation headers, so do not test by opening
`index.html` from disk or with a generic static server. `PORT=<n>` overrides the default 3737 (moved off
3000, which a local Playwright server container also binds).

Biome is a pinned devDependency (`-E`); `bun run` uses that copy, not a system `biome`.

## Architecture

The app is a thin layer over Stefan Haack's `chess-console` / `cm-chessboard` / `cm-engine-runner` /
`cm-web-modules` packages, imported by deep source path (`chess-console/src/...`). Those packages ship
no type declarations, so files that subclass them carry `// @ts-nocheck`. Their source (upstream at
github.com/shaack, or `https://unpkg.com/<pkg>@<version>/src/...`) is the reference for behavior.
Anything `src/` imports directly (including `chess.mjs` and `cm-chess`) must be listed in
`package.json`, not relied on as a transitive dependency.

- `src/main.js` — composition root. Builds `ChessConsole` with a `LocalPlayer` vs. `StockfishPlayer`,
  then (after `Board` initializes) wires the chess-console components, `StockfishAnalysis`, dark mode,
  board theme/piece set, the setup/FEN/PGN modal, and one delegated `document.body` click handler for
  all custom toolbar buttons (`btn-setup`, `btn-hint`, `btn-swap-sides`, ...).
- Components talk through `chessConsole.messageBroker` (`CONSOLE_MESSAGE_TOPICS`: `legalMove`,
  `moveUndone`, `load`, `newGame`, `initGame`) and `Observe.property` on `chessConsole.state`.
  `main.js` re-drives Board/HistoryControl/CapturedPieces/History redraws from a `plyViewed` observer
  because their own observers do not take effect in this build — keep that workaround.
- Two independent engine instances: `StockfishPlayer` (plays moves; opening book via `PolyglotRunner`
  on `assets/books/openings.bin`, then Stockfish) and `StockfishAnalysis` (MultiPV analysis panel,
  arrows, hint). Both use `CustomStockfishRunner`, which overrides `calculateMove` to send
  Threads (only on change) / `UCI_LimitStrength`+`UCI_Elo` / Skill Level and `go movetime` vs.
  `go depth`, and exposes the pure `parseInfoLine` parser. Engine options persist inside the worker
  between searches, so every search must set each option it depends on explicitly.
- `StockfishAnalysis` never starts a search while one is running: `analyze()` sends `stop` and the
  next search starts on the engine's `bestmove` reply, so late `info` lines from the old position
  are dropped. Keep that handshake if the analysis flow changes.
- User FEN/PGN goes through `src/GameImport.js` before `chessConsole.newGame()`. chess-console
  loads a bad position half-way instead of failing, and a bare-FEN PGN must not end with `*`.
- `chessConsole.i18n` is one shared dictionary: `load()` from any component overwrites same-named
  keys app-wide. Prefix keys per component (`analysis_*`, `fixedDepth`, ...).
- Game modes are `pve`, `pvp` and `analysis`, stored in player props/state as `gameMode`. `searchMode`
  is `skill`, `elo`, `depth` or `time`. `StockfishNewGameDialog` (via `StockfishGameControl`,
  which extends chess-console's `GameControl`) collects these settings and they persist through
  chess-console `Persistence` under the `Stockfish` save prefix; the UI theme is separate, in
  `localStorage` key `stockfish-ui-theme`.
- `src/Config.js` holds every engine default and range, the worker path and board theme lists.
  Change values there, not at call sites.
- `src/bootstrap-global.js` must be imported before any chess-console module: chess-console's
  `bootstrap-show-modal` dependency expects a global `window.bootstrap`.
- Mobile user agents force `threads: 1`.

## Build and deployment details

- Output is `dist/`. `scripts/copy-assets.js` copies opening books, cm-chessboard piece/marker/arrow
  SVGs from `node_modules`, and everything in `public/` (engine worker + `.wasm`, manifest, icons,
  `_headers`, `theme-init.js`, `coi-serviceworker.js`) into `dist/`, and fails the build on a missing
  source. A new static file goes under `public/` or into that script's list.
- Bun's HTML bundler folds classic `<script>` tags from `index.html` into the deferred module bundle,
  so scripts that must run as classic scripts before first paint (`theme-init.js`,
  `coi-serviceworker.js`, which needs `document.currentScript`) are not in `index.html`:
  `scripts/inject-static-tags.js` adds them, plus the manifest and apple-touch-icon, to
  `dist/index.html`. `bun run dev` skips that step, so dev has no theme-init and no COI fallback.
- Multi-threaded Stockfish needs `SharedArrayBuffer`, i.e. `Cross-Origin-Opener-Policy: same-origin`
  and `Cross-Origin-Embedder-Policy: require-corp`. `public/coi-serviceworker.js` (third-party,
  minified, excluded from Biome) is the fallback for hosts that cannot set headers.
- `public/_headers` is the single source for COOP/COEP and the CSP: Netlify serves it from `dist/`,
  and `server.js` reads it through `headers.js`. Do not add headers to `netlify.toml`. The CSP allows
  only `'self'` plus `'wasm-unsafe-eval'` (no inline scripts, no CDNs) — bundle everything.
- `assets/styles/screen.css` is compiled from `screen.scss` (no build step for it in this repo) and,
  like `public/engine/`, is excluded from Biome.

## Engine version bumps

In code, the version lives only in `ENGINE_CONFIG.NAME` and `ENGINE_CONFIG.WORKER_PATH`
(`src/Config.test.js` fails if they disagree or the worker/`.wasm` is missing from `public/engine/`).
Static text still hard-codes it: the three meta descriptions in `index.html`, `public/manifest.json`,
`README.md` and `SECURITY.md`. Grep for the old version number after swapping the binary.

## Conventions

- Biome: tabs, double quotes, recommended rules, organized imports. Run `bun run lint:fix` rather
  than hand-formatting.
- HTML built from strings must pass dynamic values through `escapeHtml` from `src/Utils.js`.
- License is AGPL-3.0; `StockfishPlayer.js` retains Stefan Haack's MIT header — keep upstream headers.
