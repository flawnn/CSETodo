import type { DatabaseService } from '$root/database/db';
import type { PrismaClient } from '@prisma/client';
import type forge from 'node-forge';

export abstract class IUserService {
	protected db: PrismaClient;

	constructor(private database: DatabaseService) {
		this.db = database.getDb();
	}

	public abstract createUser(
		session_id: string,
		dek: string,
		publicKey: forge.pki.rsa.PublicKey
	): Promise<{
		token: string;
	}>;

	public abstract findUser(
		id: string | undefined,
		public_key: string | undefined
	): Promise<unknown>;

	public abstract decodeJwtToken(cookies: Record<string, string>): Promise<any>;

	public abstract getTodos(id: string): Promise<string>;

	public abstract updateTodos(encrypted_todos: string, id: string): Promise<void>;
}
