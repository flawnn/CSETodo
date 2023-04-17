import type { PrismaClient, users } from '@prisma/client';
import { afterAll, afterEach, assert, beforeAll, describe, it, vi, type Mock } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { DBManager } from '../db_manager';
import { testConfig } from '../fixtures/test_config';
import { testUser } from '../fixtures/test_user';

// MOCKS
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
fetchMocker.dontMock();

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

// Test-related imports (due to need of manual hoisting down here)
import { GET, POST } from '$root/routes/api/tasks/+server';
import { database as applicationDB } from '../../database/db';
import { createRequestEvent } from '../util';

describe('/api/tasks endpoint', () => {
	const testDBManager = new DBManager();

	/**
	 * Setup
	 */
	beforeAll(async () => {
		await testDBManager.start();
		(applicationDB.getDb as Mock).mockImplementation(
			() => testDBManager.connection as PrismaClient
		);
	});

	afterEach(() => {
		testDBManager.cleanup() as any;
		vi.restoreAllMocks();
	});

	afterAll(() => testDBManager.stop());

	/**
	 * Tests
	 */
	it('returns encrypted tasks via GET', async () => {
		let user = (await testDBManager.connection?.users?.findFirst({
			where: {
				public_key: testUser.public_key
			}
		})) as users;

		let res = await GET(createRequestEvent('/api/tasks', 'GET'));

		assert.isTrue(res.status == 200);
		assert.equal(await res.text(), user?.todos);
	});

	it('updates todos via POST', async () => {
		let res = await POST(createRequestEvent('/api/tasks', 'POST', 'TEST'));

		let user = (await testDBManager.connection?.users?.findFirst({
			where: {
				public_key: testUser.public_key
			}
		})) as users;

		assert.isTrue(res.status == 200);
		assert.equal(await res.text(), '1');
		assert.equal(user.todos, 'TEST');
	});
});
