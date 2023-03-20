/// <reference types="cypress" />

import 'cypress-wait-until';
import { getDefaultCookieOptions } from '../../src/lib/util';

describe('Main Page (authenticated)', () => {
	// Load essential data for E2E testing
	beforeEach(() => {
		cy.setCookie('sessiontoken', Cypress.env('sessiontoken'), getDefaultCookieOptions());
		cy.setCookie('client_id', Cypress.env('client_id'), getDefaultCookieOptions());
					window.localStorage.setItem('public_key', Cypress.env('public_key'));
			window.localStorage.setItem('dek', Cypress.env('dek'));
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
	beforeEach(() => {
		cy.clearCookies()
		cy.clearAllLocalStorage()
	})

	it('Onboarding', () => {
		cy.visit('/');
       cy.contains("Sign-Up").should('exist')
	});

	it('Sign-up', () => {
		cy.visit('/');

		cy.intercept("/?/register").as("register-req")
		cy.contains("Register").click()

		cy.wait("@register-req")
		cy.location('pathname').should('include', '/');
		
		cy.contains("-----BEGIN RSA PRIVATE KEY-----")
		cy.contains("SAVE this")
	})

	it('Log-in', () => {
		cy.visit('/');

		let testtokens = Cypress.env("test_token_pair")
		cy.contains('button', "Login").click()

		cy.get('textarea').then(textArea => {
      		textArea.text(testtokens["private_key"]);
		});

		cy.contains('button', "Login").click()
		
		cy.contains("Todo 1")
		cy.get("#avatar").click()
		cy.contains(/.*0xd8f9f*/)
	})
});
