import { getDefaultCookieOptions } from '$root/lib/util';
import { UserController } from '$root/services/users';
import { Base64 } from 'js-base64';
import forge from 'node-forge';
import type { Actions } from './../../.svelte-kit/types/src/routes/$types.d';

export const actions = {
	/**
	 *  Generates symmetric and asymmetric key pairs when registering.
	 *  Returns whether everything was successful as well as the private key to show the user for recovery
	 *
	 */
	register: async ({ cookies }) => {
		const client_id = cookies.get('client_id')!;

		const dek = forge.random.getBytesSync(32);
		const key_pair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
		const public_key = forge.pki.publicKeyToPem(key_pair.publicKey);

		let res = await UserController.getInstance().createUser(client_id, dek, key_pair.publicKey);

		if (res.error ?? false) {
			return res;
		} else {
			cookies.set('sessiontoken', res.token, getDefaultCookieOptions());

			return {
				success: true,
				private_key: forge.pki.privateKeyToPem(key_pair.privateKey),
				public_key: Base64.encode(public_key, true),
				dek: Base64.encode(dek, true)
			};
		}
	}
} satisfies Actions;
