// https://docs.cypress.io/api/introduction/api.html

describe('Landing page', () => {
  it('As a user, I want to be taken to the landing page and have the option to borrow or fund a loan.', () => {
    cy.visit('http://localhost:3333/')
    cy.get('[data-cy="fund-loan-button"]').should('exist')
    cy.get('[data-cy="borrow-button"]').should('exist')
  })
})
