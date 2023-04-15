import request from 'supertest';
import { afterAll, afterEach, assert, beforeAll, describe, it, vi, type Mock } from 'vitest';
import { database as applicationDB } from '../../database/db';
import { DBManager } from '../db_manager';
import { testConfig } from '../fixtures/test_config';
import { testUser } from '../fixtures/test_user';
import { testCredentials } from './../fixtures/test_credentials';

const testDBManager = new DBManager();

vi.mock('../../database/db', () => {
	return {
		database: {
			getDb: vi.fn()
		}
	};
});

vi.mock('$env/static/private', () => {
	return {
		JWT_SECRET: testConfig.testingJwtSecret
	};
});

describe('/api/tasks endpoint', () => {
	// Test database related stuff
	beforeAll(async () => {
		await testDBManager.start();
		(applicationDB.getDb as Mock).mockImplementation(() => testDBManager.connection);
	});

	afterEach(() => {
		testDBManager.cleanup() as any;
		vi.restoreAllMocks();
	});

	afterAll(() => testDBManager.stop());

	it('returns encrypted tasks via GET', async () => {
		let user = await testDBManager.connection?.users?.findFirst({
			where: {
				public_key: testUser.public_key
			}
		});

		request('http://localhost:5173/api')
			.get('/tasks')
			.set(
				'Cookie',
				Object.entries(testCredentials.cookies).reduce(
					(p, v) => (p += v[0] + '=' + v[1] + '; '),
					''
				)
			)
			.expect(200)
			.then((res) => {
				assert(res.body, user?.todos);
			});
	});

	it('updates todos via POST', () => {});
});
