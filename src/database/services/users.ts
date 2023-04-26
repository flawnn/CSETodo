import { JWT_SECRET } from '$env/static/private';
import { Config } from '$root/config';
import type { Database } from '$root/database/db';
import { encryptTodos } from '$root/lib/encryption/util';
import { TOKENS } from '$root/lib/tokens';
import { IUserService } from '$root/types/database/IUserService';
import { injected } from 'brandi';
import { Base64 } from 'js-base64';
import jwt from 'jsonwebtoken';
import forge from 'node-forge';
import type { JwtData } from '../../types/helper/JwtData';

export class UserService extends IUserService {
	constructor(private database: Database) {
		super();
		this.db = database.getDb();
	}

	public async createUser(session_id: string, dek: string, publicKey: forge.pki.rsa.PublicKey) {
		const public_key_pem = forge.pki.publicKeyToPem(publicKey);

		const existingUser = await this.db.users.findFirst({
			where: {
				public_key: public_key_pem
			}
		});

		// Generate encrypted, default set of todos
		const defaultTodoSet = encryptTodos(dek, Config.defaultTodos);

		if (!existingUser) {
			let newUser;
			try {
				newUser = await this.db.users.create({
					data: {
						public_key: Base64.encode(public_key_pem),
						active_sessions: [session_id],
						dek: Base64.encode(publicKey.encrypt(dek)),
						todos: defaultTodoSet
					}
				});
			} catch {
				return {
					error: 'this.db_error'
				};
			}

			const jwtData: JwtData = {
				id: newUser.id!,
				client_id: session_id
			};

			return { token: jwt.sign(jwtData, JWT_SECRET) };
		} else {
			return {
				error: 'public_key_used'
			};
		}
	}

	public async findUser(id: string | undefined, public_key: string | undefined) {
		let query: { [k: string]: any } = {};

		if (id != null) {
			query.id = id;
		} else if (public_key != null) {
			query.public_key = public_key;
		} else {
			throw new Error('Missing params');
		}

		const user = await this.db.users.findUnique({
			where: query
		});

		return user;
	}

	public async getUserByCookies(cookies: Record<string, string>) {
		if (cookies['sessiontoken']) {
			const token = cookies['sessiontoken'];

			try {
				const jwtUser = jwt.verify(token, JWT_SECRET);
				if (typeof jwtUser === 'string') {
					throw new Error('Something went wrong');
				}

				const user = await this.db.users.findUnique({
					where: {
						id: jwtUser.id
					}
				});

				if (!user) {
					throw new Error('User not found');
				}

				// -> User session object
				return {
					id: user.id,
					client_id: jwtUser.client_id as string
				} satisfies JwtData;
			} catch (error) {
				return null;
			}
		}
	}

	public async getTodos(id: string) {
		let dbUser = await this.findUser(id, undefined);

		if (dbUser) {
			return dbUser!.todos;
		}
	}

	public async updateTodos(encrypted_todos: string, id: string): Promise<void> {
		try {
			await this.db.users.update({
				where: {
					id: id
				},
				data: {
					todos: encrypted_todos
				}
			});
		} catch {
			throw new Error('User not found');
		}
	}
}

injected(UserService, TOKENS.Database);
