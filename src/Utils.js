/**
 * Utility functions for the application
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {*} unsafe
 * @returns {string}
 */
export function escapeHtml(unsafe) {
	if (unsafe === undefined || unsafe === null) {
		return "";
	}
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
		"/": "&#x2F;",
	};
	return String(unsafe).replace(/[&<>"'/]/g, (s) => map[s]);
}
