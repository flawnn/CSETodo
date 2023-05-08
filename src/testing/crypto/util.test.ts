import { Config } from '$root/config';
import { decryptTodos, encryptTodos, getPublicKeyFromPrivateKey } from '$root/lib/encryption/util';
import type { Todos } from '$root/types/helper/Todo';
import { Base64 } from 'js-base64';
import forge from 'node-forge';
import { testUser } from '../fixtures/test_user';
import { testCredentials } from './../fixtures/test_credentials';

describe('Crypto Operations (decrypt, encrypt, private-key to public-key', () => {
	it('generates public key from private key', () => {
		const forge_pk = forge.pki.privateKeyFromPem(testCredentials.private_key);
		expect(Base64.encode(getPublicKeyFromPrivateKey(forge_pk))).toMatch(
			testCredentials.localStorage.public_key
		);
	});

	it('decrypts todos successfully', () => {
		expect(decryptTodos(Base64.decode(testCredentials.localStorage.dek), testUser.todos)).toEqual(
			Config.defaultTodos as Todos[]
		);
	});

	it('encrypts todos successfully', () => {
		expect(
			encryptTodos(Base64.decode(testCredentials.localStorage.dek), Config.defaultTodos as Todos[])
		).toEqual(testUser.todos);
	});
});
