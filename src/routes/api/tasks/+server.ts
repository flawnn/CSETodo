import { TOKENS } from '$root/lib/tokens';
import { error, type RequestHandler } from '@sveltejs/kit';
import { container } from './../../../lib/di_containter';

// Only two methods as we only update/get data over the server
export const POST = (async ({ request, locals }) => {
	let userService = container.get(TOKENS.UserService);
	let todos: string = await request.text();

	if (todos.length != 0) {
		try {
			await userService.updateTodos(todos, locals.user.id);
		} catch (e) {
			// Might be a unsafe practice but for debugging purposes
			throw error(500, e as string);
		}
	} else {
		throw error(400, 'Empty body');
	}

	return new Response(String('1'));
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
	let todos = await container.get(TOKENS.UserService).getTodos(locals.user.id);

	return new Response(todos);
}) satisfies RequestHandler;
