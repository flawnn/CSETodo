export const Config = {
	// Default set of Todo's that a new user gets
	defaultTodos: [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	],
	defaultCookieSettings: {
		path: '/',
		httpOnly: false,
		sameSite: 'strict',
		secure: false,
		maxAge: 60 * 60 * 24 * 30 * 120
	} as Object
};
