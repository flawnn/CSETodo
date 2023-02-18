import * as forge from 'node-forge';

function getPublicKeyFromPrivateKey(privateKey: string): string {
	var forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);

	var forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

	var publicKey = forge.pki.publicKeyToPem(forgePublicKey);

	return publicKey;
}

export { getPublicKeyFromPrivateKey };

