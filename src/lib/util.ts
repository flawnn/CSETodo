import * as forge from 'node-forge';

function getPublicKeyFromPrivateKey(forgePrivateKey: forge.pki.rsa.PrivateKey): string {
	var forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

	var publicKey = forge.pki.publicKeyToPem(forgePublicKey);

	return publicKey;
}

export { getPublicKeyFromPrivateKey };

