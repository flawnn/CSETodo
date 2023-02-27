import { JwtData } from './types/JwtData';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: JwtData
		}
		interface PageData {
			user: JwtData | undefined
		}
		// interface Platform {}
	}

	namespace svelte.JSX {
		interface HTMLAttributes<T> {
			onclick_outside: () => void
		}
	}
}

export { };

