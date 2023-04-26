import { error, type Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import { Config } from './config';
import { UserService } from './database/services/users';

export const handle: Handle = (async ({ event, resolve }) => {
	const { headers } = event.request;
	const cookies = parse(headers.get('cookie') ?? '');
	let jwtUser = await UserService.getInstance().getUserByCookies(cookies);

	if (
		jwtUser == null &&
		(event.url.pathname.startsWith('/api/tasks') || event.url.pathname.startsWith('/api/user'))
	) {
		throw error(401, 'Unauthorized');
	}

	event.locals.user = jwtUser!;

	let uuid = event.cookies.get('client_id');
	if (uuid == null) {
		uuid = uuidv4();
		event.cookies.set('client_id', uuid, Config.defaultCookieSettings);
	} else if (event.locals.user != null && event.locals.user.client_id != uuid) {
		// TODO: Reset everything, cookies have been tampered with
	}

	return await resolve(event);
}) satisfies Handle;
