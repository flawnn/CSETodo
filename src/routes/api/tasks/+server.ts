import { getTodos } from '$root/services/users';
import type { RequestHandler } from "@sveltejs/kit";

// Only two methods as we only update/get data over the server
export const POST = (({ params, url }) => {
 
  return new Response(String("GG"));
}) satisfies RequestHandler;


export const GET = (async ({ params, url, locals }) => {
  let todos = await getTodos(locals.user.id);

  return new Response(todos);
}) satisfies RequestHandler;

