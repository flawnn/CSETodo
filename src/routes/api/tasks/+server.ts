import { getTodos, updateTodos } from '$root/services/users';
import { error, type RequestHandler } from "@sveltejs/kit";

// Only two methods as we only update/get data over the server
export const POST = (async ({ params, url, request, locals }) => {
  let todos: string = await request.text();
  
      try {
        updateTodos(todos, locals.user.id);
			} catch (e) {
        throw error(500)
			}

  return new Response(String("GG"));
}) satisfies RequestHandler;


export const GET = (async ({ params, url, locals }) => {
  let todos = await getTodos(locals.user.id);

  return new Response(todos);
}) satisfies RequestHandler;

