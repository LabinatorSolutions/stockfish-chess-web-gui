// Sets the color theme before first paint so dark-mode users do not see a
// light flash. Loaded as a classic script in <head> (the CSP blocks inline
// scripts). src/main.js owns the toggle and uses the same storage key.
(() => {
	let theme = null;
	try {
		theme = localStorage.getItem("stockfish-ui-theme");
	} catch {
		// storage blocked (private mode, sandboxed iframe): fall back to the OS
	}
	if (!theme) {
		theme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	document.documentElement.setAttribute("data-bs-theme", theme);
})();
