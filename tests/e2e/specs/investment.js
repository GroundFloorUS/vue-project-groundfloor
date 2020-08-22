describe('Invesment', () => {
  before(() => {
    cy.visit('http://localhost:3333/')
    cy.get('[data-cy="invest-menu"]').click()
    cy.get('[data-cy="funding-page-link"]').click()
  })

  it('As a investor, I want to be able to select an investment and be take to the investment page', () => {
    cy.get('[data-cy="investment-item"]')
      .first()
      .within(_ => {
        cy.get('[data-cy="investment-link"]').click()
      })
    cy.url().should('include', 'investment')
  })

  it('As an investor, the submit button should be disabled when the amount funded is invalid so that I cannot fund invalid amount of money.', () => {
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })

  it('As a borrower, I can only input an amount greater than 0 so that I cannot submit 0 dollars.', () => {
    cy.get('[data-cy="fund-input"]').should('have.value', '0')
    cy.contains('You must contribute a minimum of $1')
    cy.get('[data-cy="submit-button"]').should('be.disabled')
    cy.get('[data-cy="fund-input"]')
      .clear()
      .type('5')
    cy.get('[data-cy="submit-button"]').should('be.enabled')
    cy.contains('You must contribute a minimum of $1').should('not.exist')
  })

  it('As a borrower, I can only input an amount less than or equal to the remaining amount so that I cannot submit more money than what is left.', () => {
    cy.get('[data-cy="fund-input"]').type(999999999999999)
    cy.contains('You cannot contribute more than the amount left')
    cy.get('[data-cy="submit-button"]').should('be.disabled')
    cy.get('[data-cy="fund-input"]')
      .clear()
      .type('5')
    cy.get('[data-cy="submit-button"]').should('be.enabled')
    cy.contains('You cannot contribute more than the amount left').should(
      'not.exist'
    )
  })
})
