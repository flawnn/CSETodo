import type { Todos } from '$root/types/helper/Todo';
import { Base64 } from 'js-base64';
import forge from 'node-forge';

function getPublicKeyFromPrivateKey(forgePrivateKey: forge.pki.rsa.PrivateKey): string {
	const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

	const publicKey = forge.pki.publicKeyToPem(forgePublicKey);

	return publicKey;
}

function decryptTodos(dek: string, todos: string): Todos[] {
	const decipher = forge.cipher.createDecipher('AES-CBC', dek);

	// TODO: DON'T USE CONSTANT IV
	decipher.start({ iv: 'GGGGGGGGGGGGGGGG' });
	decipher.update(forge.util.createBuffer(forge.util.hexToBytes(Base64.decode(todos))));
	decipher.finish();

	const decrypted: Todos[] = JSON.parse(decipher.output.toString());

	return decrypted;
}

function encryptTodos(dek: string, todos: Todos[]): string {
	const cipher = forge.cipher.createCipher('AES-CBC', dek);
	cipher.start({ iv: 'GGGGGGGGGGGGGGGG' });
	cipher.update(forge.util.createBuffer(JSON.stringify(todos)));
	cipher.finish();
	return Base64.encode(cipher.output.toHex());
}

export { decryptTodos, encryptTodos, getPublicKeyFromPrivateKey };
