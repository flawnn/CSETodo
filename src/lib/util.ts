import type { Todos } from '$root/types/Todo';
import { Base64 } from 'js-base64';
import forge from 'node-forge';

function getPublicKeyFromPrivateKey(forgePrivateKey: forge.pki.rsa.PrivateKey): string {
	var forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

	var publicKey = forge.pki.publicKeyToPem(forgePublicKey);

	return publicKey;
}

function decryptTodos(dek: string, todos: string): Todos[] {
	var decipher = forge.cipher.createDecipher('AES-CBC', dek);

	// TODO: DON'T USE CONSTANT IV
	decipher.start({ iv: 'GGGGGGGGGGGGGGGG' });
	decipher.update(forge.util.createBuffer(forge.util.hexToBytes(Base64.decode(todos))));
	decipher.finish();

	const decrypted: Todos[] = JSON.parse(decipher.output.toString());

	return decrypted;
}

function encryptTodos(dek: string, todos: Todos[]): string {
	var cipher = forge.cipher.createCipher('AES-CBC', dek);
	cipher.start({ iv: 'GGGGGGGGGGGGGGGG' });
	cipher.update(forge.util.createBuffer(JSON.stringify(todos)));
	cipher.finish();
	return Base64.encode(cipher.output.toHex());
}

// /**
//  * TODO: This actually doesn't work as it is supposed to be. For one, deleted and modified todos are not reflected,
//  * and due to Prisma, using the app simultaneously on two devices, breaks the app and lets the server crash.
//  * Refreshing while using the app would need a massive Refactor of the way we interact with the database and logic
//  *  */
// async function updateTodosFromServer(todos: Todos[], dek: string): Promise<Todos[]> {
//     let res = await (await fetch('/api/tasks', {
// 				method: 'GET',
//                 credentials: "same-origin",
//     })).text();

//     let decrypted = decryptTodos(dek, res);

//     for(let todo of decrypted) {
//         let counterpart = todos.some(x => x.id == todo.id)

//         if(!counterpart) {
//             todos.push(todo)
//         }
//     }

//     return todos;
// }

function getDefaultCookieOptions(): Object {
	return {
		path: '/',
		httpOnly: false,
		sameSite: 'strict',
		secure: false,
		maxAge: 60 * 60 * 24 * 30 * 120
	};
}
export { decryptTodos, encryptTodos, getDefaultCookieOptions, getPublicKeyFromPrivateKey };
