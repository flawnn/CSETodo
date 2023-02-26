import type { LayoutServerLoad } from "./$types";


export const load = (async ({ cookies, locals }) => {
  const user = locals.user;
 
  if (user) {
	return {
		user: user
	}
  } else {
	return {
		user: undefined
	}
  }
}) satisfies LayoutServerLoad;
