/// <reference types="cypress" />
import 'cypress-wait-until';
import { getDefaultCookieOptions } from '../../src/lib/util';

describe('Main Page (authenticated)', () => {
	// Load essential data for E2E testing
	beforeEach(() => {
		cy.setCookie('sessiontoken', Cypress.env('sessiontoken'), getDefaultCookieOptions());
		cy.setCookie('client_id', Cypress.env('client_id'), getDefaultCookieOptions());

		Cypress.on('window:before:load', (win) => {
			win.localStorage.setItem('public_key', Cypress.env('public_key'));
			win.localStorage.setItem('dek', Cypress.env('dek'));
		});
	});

	it('Loads Successfully', () => {
		cy.visit('/');

    cy.waitUntil(function() {
      return Cypress.$('.spinner').length == 0
  })
    cy.contains("Sign-Up").should('not.exist')
	});
});

describe('Main Page (unauthenticated)', () => {
	it('Loads Successfully', () => {
		cy.visit('/');
       cy.contains("Sign-Up").should('exist')
	});
});
