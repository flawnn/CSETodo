import { PrismaClient } from '@prisma/client';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { testUser } from './fixtures/test_user';

const COLLECTIONS = ['users'];

class DBManager {
	server: any;
	connection: Partial<PrismaClient | null>;

	constructor() {
		this.server = null;
		this.connection = null;
	}

	async start() {
		this.server = await MongoMemoryReplSet.create({ replSet: { storageEngine: 'wiredTiger' } });
		const url = (this.server as MongoMemoryReplSet).getUri('todoApp');

		this.connection = new PrismaClient({
			datasources: {
				db: {
					url: url
				}
			}
		});

		// Insert new user
		await this.connection.users?.create({
			data: { ...testUser }
		});
	}

	stop() {
		this.connection?.$disconnect!();
		return this.server.stop();
	}

	async cleanup() {
		// Delete all user data from users
		await Promise.all(COLLECTIONS.map((c) => this.connection?.users?.deleteMany({ where: {} })));

		// Insert new user
		await this.connection!.users?.create({
			data: { ...testUser }
		});
	}
}

export { DBManager };
