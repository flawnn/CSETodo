import type { Todos } from '$root/types/Todo';
import * as forge from 'node-forge';

function getPublicKeyFromPrivateKey(forgePrivateKey: forge.pki.rsa.PrivateKey): string {
	var forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

	var publicKey = forge.pki.publicKeyToPem(forgePublicKey);

	return publicKey;
}

function decryptTodos(dek: string, todos: string): Todos[] {
	var decipher = forge.cipher.createDecipher('AES-CBC', dek);

    // TODO: DON'T USE CONSTANT IV
    decipher.start({ iv: 'GGGGGGGGGGGGGGGG' })
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(todos)));
    decipher.finish()

    const decrypted: Todos[] = JSON.parse(decipher.output.toString())

    return decrypted
}

export { getPublicKeyFromPrivateKey, decryptTodos };

