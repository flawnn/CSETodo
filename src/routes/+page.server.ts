import { Config } from '$root/config';
import { container } from '$root/lib/di_containter';
import { TOKENS } from '$root/lib/tokens';
import { error } from '@sveltejs/kit';
import { Base64 } from 'js-base64';
import forge from 'node-forge';
import type { Actions } from './../../.svelte-kit/types/src/routes/$types.d';

export const actions: Actions = {
	/**
	 *  Generates symmetric and asymmetric key pairs when registering.
	 *  Returns whether everything was successful as well as the private key to show the user for recovery
	 *
	 */
	register: async ({ cookies }) => {
		const client_id = cookies.get('client_id');

		if (!client_id) {
			throw error(501, 'Missing client_id');
		}

		const dek = forge.random.getBytesSync(32);
		const key_pair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
		const public_key = forge.pki.publicKeyToPem(key_pair.publicKey);

		try {
			const res = await container
				.get(TOKENS.UserService)
				.createUser(client_id, dek, key_pair.publicKey);

			cookies.set('sessiontoken', res.token, Config.defaultCookieSettings);

			return {
				success: true,
				private_key: forge.pki.privateKeyToPem(key_pair.privateKey),
				public_key: Base64.encode(public_key, true),
				dek: Base64.encode(dek, true)
			};
		} catch (e) {
			throw error(501, (e as Error).message);
		}
	}
};
