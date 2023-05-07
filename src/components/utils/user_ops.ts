export const ops = {
	logout: function logout() {
		localStorage.clear();

		// Clearing cookies
		document.cookie.split(';').forEach(function (c) {
			document.cookie = c
				.replace(/^ +/, '')
				.replace(/=.*/, '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
		});

		location.reload();
	}
};
