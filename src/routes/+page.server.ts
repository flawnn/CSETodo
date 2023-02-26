import { createUser } from '$root/services/users';
import { Base64 } from 'js-base64';
import * as forge from 'node-forge';
import type { Actions } from './../../.svelte-kit/types/src/routes/$types.d';

export const actions = {
  /**
   *  Generates symmetric and asymmetric key pairs when registering. 
   *  Returns whether everything was successful as well as the private key to show the user for recovery
   * 
   * @returns 
   */
  register: async ({ cookies, request, locals }) => {
	const client_id = cookies.get("client_id")!;

	const dek = forge.random.getBytesSync(32);
    const key_pair = forge.pki.rsa.generateKeyPair({bits: 2048});
	const public_key = Base64.encode(forge.pki.publicKeyToPem(key_pair.publicKey));

	let res = await createUser(client_id , key_pair.publicKey.encrypt(dek), public_key)
	
	if(res.error ?? false){
		return res
	} else {
		cookies.set("sessiontoken", res.token)
		localStorage.setItem('dek', dek);
		localStorage.setItem('public_key', public_key)

		return { success: true, private_key: key_pair.privateKey }
	}
  }
} satisfies Actions;