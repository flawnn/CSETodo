import { db } from '$root/services/db';
import { createUser } from '$root/services/users';
import type { Actions, PageServerLoad } from './../../.svelte-kit/types/src/routes/$types.d';

export const load = (async ({ cookies, locals, request }) => {
  const user = locals.user;
 
  if (user) {
	// Load Todos from Server & Decrypt
  } else {
	return {
		onboardingNeeded: true,
		user: {}
	}
  }
}) satisfies PageServerLoad;


export const actions = {
  register: async ({ cookies, request }) => {
    const data = await request.formData();

	// Weird casts needed to have the TS linter be content
	const session_id = data.get("session_id") as string;
	const dek = data.get('dek') as string;
    const public_key = data.get('public_key') as string;

	let res = await createUser(session_id , dek ,public_key)
	
	if(res.error ?? false){
		return res
	} else {
		cookies.set("sessiontoken", res.token)
		return { success: true }
	}
  }
} satisfies Actions;