import { IDatabase } from '$root/types/database/IDatabase';
import { PrismaClient } from '@prisma/client';

// Wrapper class for the database because of SRP (Single-Responsibility-Principle) as I seperate the responsibility of managing the database from the rest of the application logic
// This enables me to make the code more modular and easier to test as I can work with e.g. mocking
export class Database extends IDatabase {
	public createDbClient(): PrismaClient {
		return new PrismaClient();
	}
}

export class TestDatabase extends IDatabase {
	constructor(testDb: PrismaClient) {
		super();
		this.db = testDb;
	}

	public createDbClient(): PrismaClient {
		return this.db;
	}
}
