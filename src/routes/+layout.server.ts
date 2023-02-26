import type { LayoutServerLoad } from "./$types";


export const load = (async ({ cookies, locals }) => {
  const user = locals.user;
 
  if (user) {
	return {
		user: user,
		client_id: cookies.get("client_id")
	}
  } else {
	return {
		user: undefined,
		client_id: cookies.get("client_id")
	}
  }
}) satisfies LayoutServerLoad;
