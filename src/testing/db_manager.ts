import { PrismaClient } from '@prisma/client';
const { MongoMemoryServer } = require('mongodb-memory-server');

const COLLECTIONS = ['users'];

class DBManager {
	db: any;
	server: any;
	connection: any;

	constructor() {
		this.db = null;
		this.server = new MongoMemoryServer();
		this.connection = null;
	}

	async start() {
		const url = await this.server.getUri();
		this.connection = new PrismaClient({
			datasources: {
				db: {
					url: url
				}
			}
		});

		// this.db = this.connection.db(await this.server.getDbName());
	}

	stop() {
		this.connection.close();
		return this.server.stop();
	}

	cleanup() {
		return Promise.all(COLLECTIONS.map((c) => this.db.collection(c).remove({})));
	}
}

export { DBManager };
