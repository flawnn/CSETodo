function generateRandomId(): string {
	return Math.random().toString(16).slice(2);
}

function getDefaultCookieOptions(): Object {
	return {
		path: '/',
		httpOnly: false,
		sameSite: 'strict',
		secure: false,
		maxAge: 60 * 60 * 24 * 30 * 120
	};
}

// /**
//  * TODO: This actually doesn't work as it is supposed to be. For one, deleted and modified todos are not reflected,
//  * and due to Prisma, using the app simultaneously on two devices, breaks the app and lets the server crash.
//  * Refreshing while using the app would need a massive Refactor of the way we interact with the database and logic
//  * @see {@link fetchTodos} which is also part of that change
//  *  */
// async function updateTodosFromServer(todos: Todos[], dek: string): Promise<Todos[]> {
//     let res = await (await fetch('/api/tasks', {
// 				method: 'GET',
//                 credentials: "same-origin",
//     })).text();

//     let decrypted = decryptTodos(dek, res);

//     for(let todo of decrypted) {
//         let counterpart = todos.some(x => x.id == todo.id)

//         if(!counterpart) {
//             todos.push(todo)
//         }
//     }

//     return todos;
// }

export {
	generateRandomId,
	getDefaultCookieOptions,
};
