import type { PrismaClient } from '@prisma/client';

export abstract class IDatabase {
	db: PrismaClient;

	constructor() {
		this.db = this.createDbClient();
	}

	abstract createDbClient(): PrismaClient;

	public getDb(): PrismaClient {
		return this.db;
	}
}
