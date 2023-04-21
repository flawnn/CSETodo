import { afterAll, afterEach, beforeAll, describe, expect, it, vi, type Mock } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { DBManager } from '../db_manager';

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

import { actions } from '$root/routes/+page.server';
import type { PrismaClient, users } from '@prisma/client';
import { database as applicationDB } from '../../database/db';
import { testCredentials } from '../fixtures/test_credentials';

describe('SvelteKit Register Action', () => {
	const testDBManager = new DBManager();

	/**
	 * Setup
	 */
	beforeAll(async () => {
		await testDBManager.start(false);
		(applicationDB.getDb as Mock).mockImplementation(
			() => testDBManager.connection as PrismaClient
		);
	});

	afterEach(async () => {
		(await testDBManager.cleanup()) as any;
		vi.restoreAllMocks();
	});

	afterAll(() => testDBManager.stop());

	it('Register Action returns set of credentials/new user data', async () => {
		let sessiontoken: string;

		let res = (await actions.register({
			cookies: {
				get: function () {
					return testCredentials.cookies.client_id;
				},
				set: function (a: any, b: any, c: any) {
					sessiontoken = b;
				}
			}
		} as any))!;

		let user;
		try {
			user = (await testDBManager.connection?.users?.findFirst({
				where: {
					active_sessions: { has: testCredentials.cookies.client_id }
				}
			})) as users;
		} catch {
			throw new Error('Error when getting user');
		}

		expect(user).not.toBeNull();
		expect(res.success).toBeTruthy();
		expect(user.public_key).toContain(res.public_key);
	});
});
