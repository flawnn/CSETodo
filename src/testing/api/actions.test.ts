/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { afterAll, afterEach, describe, expect, it, vi, type Mock } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { testConfig } from '../fixtures/test_config';

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

import { actions } from '$root/routes/+page.server';
import type { PrismaClient, users } from '@prisma/client';
import { database as applicationDB } from '../../database/db';
import { DBManager } from '../db_manager';
import { testCredentials } from '../fixtures/test_credentials';

describe('SvelteKit Register Action', async () => {
	/**
	 * Setup
	 */
	const testDBManager = new DBManager(false);
	(applicationDB.getDb as Mock).mockImplementation(() => testDBManager.connection as PrismaClient);

	afterEach(async () => {
		// (await testDBManager.cleanup()) as any;
		vi.restoreAllMocks();
	});

	afterAll(() => {
		testDBManager.stop();
	});

	/**
	 * Tests
	 */
	let sessiontoken!: string;

	const res = await actions.register({
		cookies: {
			get: function () {
				return testCredentials.cookies.client_id;
			},
			set: function (a: any, b: any, c: any) {
				sessiontoken = b;
			}
		}
	} as any);

	let user: users;
	try {
		user = (await testDBManager.connection?.users?.findFirst({
			where: {
				active_sessions: { has: testCredentials.cookies.client_id }
			}
		})) as users;
	} catch {
		throw new Error('Error when getting user');
	}

	it('returns successfully with matching data in DB', async () => {
		expect(user).not.toBeNull();
		expect(res?.success).toBeTruthy();
		expect(user.public_key).toContain(res?.public_key);
	});

	it('returns valid JWT Token', () => {
		console.log(sessiontoken);
		const payload: any = jwt.verify(sessiontoken, testConfig.testingJwtSecret);

		expect(payload.client_id).toBe(testCredentials.cookies.client_id);
		expect(payload.id).toBe(user.id);
	});
});
