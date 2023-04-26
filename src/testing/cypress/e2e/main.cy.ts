/// <reference types="cypress" />
import { DBManager } from '$root/testing/db_manager';
import { testCredentials } from '$root/testing/fixtures/test_credentials';
import 'cypress-wait-until';
import { Config } from '../../../config';

describe('Main Page (authenticated)', () => {
	/**
	 * Setup
	 */
	const testDBManager = new DBManager();

	afterEach(async () => {
		await testDBManager.cleanup();
	});

	after(() => testDBManager.stop());

	// Load essential data for E2E testing
	beforeEach(() => {
		cy.setCookie(
			'sessiontoken',
			testCredentials.cookies.sessiontoken,
			Config.defaultCookieSettings
		);
		cy.setCookie('client_id', testCredentials.cookies.client_id, Config.defaultCookieSettings);
		window.localStorage.setItem('public_key', testCredentials.localStorage.public_key);
		window.localStorage.setItem('dek', testCredentials.localStorage.dek);
	});

	it('Loads Successfully', () => {
		cy.visit('/');

		cy.waitUntil(function () {
			return Cypress.$('.spinner').length == 0;
		});
		cy.contains('Sign-Up').should('not.exist');
	});
});

describe('Main Page (unauthenticated)', () => {
	const testDBManager = new DBManager();

	/**
	 * Setup
	 */
	before(async () => {
		await testDBManager.start();
	});

	afterEach(async () => {
		await testDBManager.cleanup();
	});

	after(() => testDBManager.stop());

	beforeEach(() => {
		cy.clearCookies();
		cy.clearAllLocalStorage();
	});

	it('Onboarding', () => {
		cy.visit('/');
		cy.contains('Sign-Up').should('exist');
	});

	it('Sign-up', () => {
		cy.visit('/');

		cy.intercept('/?/register').as('register-req');
		cy.contains('Register').click();

		cy.wait('@register-req');
		cy.location('pathname').should('include', '/');

		cy.contains('-----BEGIN RSA PRIVATE KEY-----');
		cy.contains('SAVE this');
	});

	it('Log-in', () => {
		cy.visit('/');
		cy.contains('button', 'Login').click();

		cy.get('textarea').then((textArea) => {
			textArea.text(testCredentials.private_key);
		});

		cy.contains('button', 'Login').click();

		cy.contains('Todo 1');
		cy.get('#avatar').click();
		cy.contains(/.*0xbebd3*/);
	});
});
