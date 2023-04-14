import { JWT_SECRET } from '$env/static/private';
import { encryptTodos } from '$root/lib/util';
import { database } from '$root/database/db';
import type { users } from '@prisma/client';
import { Base64 } from 'js-base64';
import jwt from 'jsonwebtoken';
import forge from "node-forge";
import type { JwtData } from './../types/JwtData';

const db = database.getDb();

const createUser = async (session_id: string, dek: string, publicKey: forge.pki.rsa.PublicKey) => {
	let public_key_pem = forge.pki.publicKeyToPem(publicKey);

	let existingUser = await db.users.findFirst({
		where: {
			public_key: public_key_pem
		}
	});

	// Generate default set of todos
	var encrypted = encryptTodos(dek, [
		{ id: '1', text: 'Todo 1', completed: true },
		{ id: '2', text: 'Todo 2', completed: false },
		{ id: '3', text: 'Todo 3', completed: false },
		{ id: '4', text: 'Todo 4', completed: false }
	]);

	if (!existingUser) {
		var newUser;
		try {
			type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

			newUser = (await db.users.create({
				data: {
					public_key: Base64.encode(public_key_pem),
					active_sessions: [session_id],
					dek: Base64.encode(publicKey.encrypt(dek)),
					todos: encrypted
				}
			})) as Partial<ThenArg<ReturnType<typeof db.users.create>>>;
		} catch {
			return {
				error: 'db_error'
			};
		}

		const jwtData: JwtData = {
			id: newUser.id!,
			client_id: session_id
		};

		const token = jwt.sign(jwtData, JWT_SECRET);

		return { token };
	} else {
		return {
			error: 'public_key_used'
		};
	}
};

const findUser = async (id: string | undefined, public_key: string | undefined): Promise<users> => {
	let key = id != null ? 'id' : 'public_key';
	let query: { [k: string]: any } = {};
	if (id != null) {
		query.id = id;
	} else if (public_key != null) {
		query.public_key = public_key;
	} else {
		throw new Error('Missing params');
	}

	const user = await db.users.findUnique({
		where: query
	});

	if (!user) {
		throw new Error('User not found');
	}

	return user;
};

const getUserByCookies = async (cookies: Record<string, string>): Promise<JwtData | null> => {
	if (cookies['sessiontoken']) {
		const token = cookies['sessiontoken'];

		try {
			const jwtUser = jwt.verify(token, JWT_SECRET);
			if (typeof jwtUser === 'string') {
				throw new Error('Something went wrong');
			}

			const user = await db.users.findUnique({
				where: {
					id: jwtUser.id
				}
			});

			if (!user) {
				throw new Error('User not found');
			}

			const sessionUser: JwtData = {
				id: user.id,
				client_id: jwtUser.client_id as string
			} satisfies JwtData;

			return sessionUser;
		} catch (error) {
			console.error(error);
		}
	}

	return null;
};

const getTodos = async (id: string): Promise<string> => {
	let dbUser = await findUser(id, undefined);

	return dbUser.todos;
};

const updateTodos = async (encrypted_todos: string, id: string): Promise<void> => {
	try {
		const updateUser = await db.users.update({
			where: {
				id: id
			},
			data: {
				todos: encrypted_todos
			}
		});
	} catch (e) {
		throw new Error('User not found');
	}
};

export { createUser, findUser, getTodos, getUserByCookies, updateTodos };

