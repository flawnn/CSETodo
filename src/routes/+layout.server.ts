import type { LayoutServerLoad } from "./$types";


export const load = (async ({ cookies, locals }) => {
  	const user = locals.user;
 
	return {
		user: user ?? undefined,
		client_id: cookies.get("client_id")
	}
}) satisfies LayoutServerLoad;
