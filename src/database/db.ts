import { PrismaClient } from '@prisma/client';

// Wrapper class for the database because of SRP (Single-Responsibility-Principle) as I seperate the responsibility of managing the database from the rest of the application logic
// This enables me to make the code more modular and easier to test as I can work with e.g. mocking
class Database {
	private db: PrismaClient;

	constructor() {
		this.db = new PrismaClient();
	}

	public getDb(): PrismaClient {
		return this.db;
	}
}

const database = new Database();

export { database };
