window.coi = {
	doRegistration: (s) => {
		const pathParts = window.location.pathname.split("/");
		const scope = `${pathParts.slice(0, -1).join("/")}/`;
		return navigator.serviceWorker.register(s, { scope: scope });
	},
};
