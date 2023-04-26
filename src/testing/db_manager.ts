import { PrismaClient } from '@prisma/client';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { testUser } from './fixtures/test_user';

const COLLECTIONS = ['users'];

class DBManager {
	server?: MongoMemoryReplSet;
	connection?: PrismaClient;

	constructor(insertUser?: boolean) {
		this.start(insertUser);
	}

	async start(insertUser?: boolean) {
		this.server = await MongoMemoryReplSet.create({ replSet: { storageEngine: 'wiredTiger' } });
		const url = (this.server as MongoMemoryReplSet).getUri('todoApp');

		this.connection = new PrismaClient({
			datasources: {
				db: {
					url: url
				}
			}
		});

		if (insertUser ?? true) {
			// Insert new user
			await this.connection.users?.create({
				data: { ...testUser }
			});
		}
	}

	stop() {
		this.connection?.$disconnect?.();
		return this.server?.stop();
	}

	async cleanup() {
		// Delete all user data from users
		await Promise.all(COLLECTIONS.map(() => this.connection?.users?.deleteMany({ where: {} })));

		// Insert new user
		await this.connection?.users?.create({
			data: { ...testUser }
		});
	}
}

export { DBManager };
