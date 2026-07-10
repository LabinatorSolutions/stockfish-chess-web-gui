/**
 * chess-console's GameControl pulls in the third-party "bootstrap-show-modal"
 * package, which expects a global `window.bootstrap` (the classic CDN-script
 * assumption) rather than an ES import. Must be imported before any
 * chess-console module so the global exists by the time that code runs.
 */
import * as bootstrap from "bootstrap";

/** @type {*} */ (window).bootstrap = bootstrap;

export { bootstrap };
