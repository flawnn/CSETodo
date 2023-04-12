import { findUser } from "$root/services/users";
import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ params, url, locals }) => {
    try{
        let user = await findUser(locals.user.id, undefined);
        
        return new Response(user.todos)
    } catch {
        throw error(500, "User not found")
    }
}) satisfies RequestHandler;