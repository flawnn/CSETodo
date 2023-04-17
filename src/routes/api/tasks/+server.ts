import { UserController } from '$root/services/users';
import { error, type RequestHandler } from '@sveltejs/kit';

// Only two methods as we only update/get data over the server
export const POST = (async ({ request, locals }) => {
	let userController = UserController.getInstance();
	let todos: string = await request.text();

	if (todos.length != 0) {
		try {
			userController.updateTodos(todos, locals.user.id);
		} catch (e) {
			throw error(500);
		}
	} else {
		throw error(400, 'Empty body');
	}

	return new Response(String('1'));
}) satisfies RequestHandler;

export const GET = (async ({ locals }) => {
	let todos = await UserController.getInstance().getTodos(locals.user.id);

	return new Response(todos);
}) satisfies RequestHandler;
