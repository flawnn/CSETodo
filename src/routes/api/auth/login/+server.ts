import { JWT_SECRET } from '$env/static/private';
import { Config } from '$root/config';
import { container } from '$root/lib/di_container';
import { TOKENS } from '$root/lib/tokens';
import type { JwtData } from '$root/types/helper/JwtData';
import { error, type RequestHandler } from '@sveltejs/kit';
import { Base64 } from 'js-base64';
import jwt from 'jsonwebtoken';
import forge from 'node-forge';
import type { sanitizedUser } from '../../../../types/helper/User';

export const POST = (async ({ request, cookies }) => {
	try {
		const body = await request.json();

		const publicKey = Base64.decode(body.payload.public_key);
		const forgePublicKey = forge.pki.publicKeyFromPem(publicKey);

		const md = forge.md.sha1.create();
		md.update(JSON.stringify(body.payload), 'utf8');

		const verified = forgePublicKey.verify(md.digest().bytes(), body.signature);

		if (verified) {
			// check if public_key is in db
			const user = await container
				.get(TOKENS.UserService)
				.findUser(undefined, body.payload.public_key);

			if (!user) {
				throw error(500, 'User not found');
			}

			const token = jwt.sign(
				{
					id: user.id,
					client_id: body.payload.client_id
				} satisfies JwtData,
				JWT_SECRET
			);

			cookies.set('sessiontoken', token, Config.defaultCookieSettings);

			const sanitizedUser: sanitizedUser = user;

			return new Response(
				JSON.stringify({
					user: sanitizedUser
				})
			);
		} else {
			throw error(500, 'Malformed signature');
		}
	} catch (e) {
		throw error(500, 'Malformed Body' + e);
	}
}) satisfies RequestHandler;
