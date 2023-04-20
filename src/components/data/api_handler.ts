
import { encryptTodos } from '$root/lib/encryption/util';
import type { Todos } from '$root/types/Todo';
import { toast } from '@zerodevx/svelte-toast';
import { Base64 } from 'js-base64';

async function pushTasksToDB(initialTodos: Todos[], newTodos: Todos[]) {
	if (newTodos != initialTodos) {
		let encrypted = encryptTodos(Base64.decode(localStorage.getItem('dek')!), newTodos);

		let res = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: encrypted,
			credentials: 'same-origin'
		});

		if (res.status == 500) {
			toast.push('Error while updating Todos. Try adding another one or reload page.');
		}
	}
}

/**
 * WIP: This is part of the update that allows multiple clients to simultaneously edit Todos. Still haven't had time until now to
 * work on a smart architecture that does this seamlessly and without too much overhead
 */
async function fetchTodos() {
	// TODO: Implement
	/* await updateTodosFromServer(initialTodos, Base64.decode(localStorage.getItem('dek')!));

    todos = initialTodos; */
}

export { fetchTodos, pushTasksToDB };
