# Security Policy

## Reporting a Vulnerability

We encourage responsible disclosure of any security vulnerabilities. If you discover a security issue, please follow these steps:

1. Do not disclose the vulnerability publicly or to other parties.
2. Contact the project maintainers directly at [https://labinator.com/contact/](https://labinator.com/contact/)
3. Provide a clear and detailed description of the issue, including steps to reproduce, and, if applicable, a proof of concept.

We will review your report and work to understand and reproduce the issue. Once confirmed, we will develop a fix and release it as part of our regular update cycle.

## Threat Model

Stockfish Chess Web GUI is a fully static, client-side application. There is no backend, no authentication, no user accounts, and no server-side data storage. The only persisted data is local to the browser (game settings and position history in `localStorage`), and never leaves the user's machine.

Given that, the practical attack surface is narrow:

- **Cross-site scripting (XSS)** via user-supplied FEN/PGN input in the Setup/Import dialog, or engine UCI output rendered in the analysis panel. All dynamic HTML insertion of untrusted or engine-derived strings goes through [`escapeHtml()`](src/Utils.js) before being written to the DOM.
- **Cross-origin isolation** — multi-threaded Stockfish (WASM + `SharedArrayBuffer`) requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. These are set as real HTTP response headers by [`server.js`](server.js), `netlify.toml`, and `public/_headers`. [`coi-serviceworker.js`](coi-serviceworker.js) is a fallback that injects the same headers via a Service Worker on static hosts that can't set custom response headers.
- **Content Security Policy** — a strict CSP (`script-src 'self' 'wasm-unsafe-eval'`, no third-party script origins) is enforced via the same header mechanisms, restricting script execution to same-origin code and blocking arbitrary inline/external script injection.
- **Third-party supply chain** — all JS dependencies (Bootstrap, Font Awesome, chess-console, cm-chessboard, etc.) are installed via npm and bundled at build time; nothing is loaded from a third-party CDN at runtime. [Dependabot](.github/dependabot.yml) opens weekly PRs for dependency updates.
- **Stockfish engine binary** — the bundled `stockfish-18-lite.js`/`.wasm` in `public/engine/` is a WASM build of the official [Stockfish](https://stockfishchess.org/) engine; it runs in an isolated Web Worker and communicates only via the UCI text protocol.

## Security Best Practices

- **Code Review:** Changes to the codebase are reviewed before merging.
- **Dependencies:** Kept current via Dependabot; `bun install` resolves from the npm registry only.
- **No secrets:** This is a static app with no API keys, tokens, or credentials anywhere in the codebase or build pipeline.

## Contributing to Security

If you're a developer and wish to contribute a security fix:

- Fork the repository and create a new branch for your changes.
- Ensure your changes do not introduce new XSS vectors (any HTML built from user or engine-derived strings must go through `escapeHtml()`) or weaken the CSP/COOP/COEP headers.
- Submit a pull request with a clear description of your changes.

## Security Updates

Security-relevant updates are published through the GitHub repository. Users are encouraged to keep their deployments current.
