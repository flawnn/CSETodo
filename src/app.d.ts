// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User
		}
		 interface PageData {
			onboardingNeeded: boolean,
			user: User,
			device_id: string
		}
		// interface Platform {}
	}
}

export { };

