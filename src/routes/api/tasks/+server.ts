import { TOKENS } from '$root/lib/tokens';
import { error, type RequestHandler } from '@sveltejs/kit';
import { container } from '../../../lib/di_container';

// Only two methods as we only update/get data over the server
export const POST = (async ({ request, locals }) => {
	const userService = container.get(TOKENS.UserService);
	const todos: string = await request.text();

	if (todos.length != 0) {
		try {
			await userService.updateTodos(todos, locals.user.id);
		} catch (e) {
			// Might be a unsafe practice but for debugging purposes
			throw error(500, e);
		}
	} else {
		throw error(400, 'Empty body');
	}

	return new Response(String('1'));
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
	try {
		const todos = await container.get(TOKENS.UserService).getTodos(locals.user.id);
		return new Response(todos);
	} catch (e) {
		throw error(500, (e).message);
	}
}) satisfies RequestHandler;
