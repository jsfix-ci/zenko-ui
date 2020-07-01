/* eslint jest/expect-expect: 0 */

describe('Authentication with keycloak', () => {
    describe('User authenticated', () => {
        beforeEach(() =>  {
            cy.kcLogin();
        });

        it('should render user name', () =>  {
            cy.visit('/');
            cy.get('.sc-navbar').should('exist');
            // NOTE: this value is based on "eve/workers/keycloakconfig/keycloak-realm.json"
            cy.get('.sc-navbar').should('contain', 'Nicolas Humbert');
        });

        afterEach(() =>  {
            cy.kcLogout();
        });
    });

    describe('User not authenticated', () => {
        it('should not render user name', () =>  {
            cy.visit('/');
            cy.get('.sc-navbar').should('not.exist');
            cy.url();
        });
    });
});
