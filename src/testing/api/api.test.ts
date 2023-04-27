import { afterAll, afterEach, assert, describe, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { testConfig } from '../fixtures/test_config';

vi.mock('$env/static/private', () => {
	return {
		JWT_SECRET: testConfig.testingJwtSecret
	};
});

// MOCKS
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
fetchMocker.dontMock();

// Test-related imports (due to need of manual hoisting down here)
import { TestDatabase } from '$root/database/db';
import { container } from '$root/lib/di_containter';
import { TOKENS } from '$root/lib/tokens';
import { GET, POST } from '$root/routes/api/tasks/+server';
import type { PrismaClient, users } from '@prisma/client';
import { DBManager } from '../db_manager';
import { testUser } from '../fixtures/test_user';
import { createRequestEvent } from '../util';

describe('/api/tasks endpoint', async () => {
	/**
	 * Setup
	 */
	const testDBManager = new DBManager();
	await testDBManager.start();
	const testDBMock = new TestDatabase(testDBManager.connection as PrismaClient);
	container
		.bind(TOKENS.Database)
		.toInstance(() => testDBMock)
		.inSingletonScope();

	afterEach(async () => {
		await testDBManager.cleanup();
		vi.restoreAllMocks();
	});

	afterAll(() => {
		testDBManager.stop();
	});

	/**
	 * Tests
	 */
	it('returns encrypted tasks via GET', async () => {
		const user = (await testDBManager.connection?.users?.findFirst({
			where: {
				public_key: testUser.public_key
			}
		})) as users;

		const res = await GET(createRequestEvent('/api/tasks', 'GET'));

		assert.isTrue(res.status == 200);
		assert.equal(await res.text(), user?.todos);
	});

	it('updates todos via POST', async () => {
		const res = await POST(createRequestEvent('/api/tasks', 'POST', 'TEST'));

		const user = (await testDBManager.connection?.users?.findFirst({
			where: {
				public_key: testUser.public_key
			}
		})) as users;

		assert.isTrue(res.status == 200);
		assert.equal(await res.text(), '1');
		assert.equal(user.todos, 'TEST');
	});
});
