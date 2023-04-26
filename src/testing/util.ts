import type { RequestEvent } from '@sveltejs/kit';
import { testCredentials } from './fixtures/test_credentials';
import { testUser } from './fixtures/test_user';

/**
 * Encode cookies for usage in HTTP headers
 */
export const cookies = Object.entries(testCredentials.cookies).reduce(
	(p, v) => (p += v[0] + '=' + v[1] + '; '),
	''
);

/**
 * Artificially generated `locals` object as a mock for native SvelteKit API handler function
 */
export const locals = { user: { client_id: testCredentials.cookies.client_id, id: testUser.id } };

/**
 * Constructs a (partial) {@link RequestEvent} object for usage in SvelteKit API tests.
 * @param path (placeholder due to API & readability reasons) To-be-requested path
 * @param body Optional body to send with the request
 * @param method HTTP method (e.g. 'GET' or 'POST')
 */
export function createRequestEvent(path: string, method: string, body?: string | undefined) {
	return {
		request: new Request(path, {
			method: method,
			headers: {
				Cookie: cookies
			},
			body: body
		}),
		locals: locals
	} as RequestEvent<Partial<Record<string, string>>, string | null>;
}
