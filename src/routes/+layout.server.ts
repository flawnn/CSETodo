import type { LayoutServerLoad } from "./$types";


export const load = (async ({ cookies, locals }) => {
  const user = locals.user;
 
  if (user) {
	// Load Todos from Server & Decrypt
  } else {
	return {
		onboardingNeeded: true,
		user: {},
		device_id: cookies.get("device_id") as String
	}
  }
}) satisfies LayoutServerLoad;
