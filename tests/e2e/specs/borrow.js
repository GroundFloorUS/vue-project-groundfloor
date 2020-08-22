describe('Borrow page', () => {
  before(() => {
    cy.visit('http://localhost:3333/')
    cy.get('[data-cy="borrow-button"]').click()
  })

  it('As a borrower, the form should be disabled until I finish all the required fields so that I cannot submit invalid data.', () => {
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })

  it('As a borrower, I should be required to have a valid address so that I cannot submit the form with no address present.', () => {
    cy.get('[data-cy="address-input"]').should('have.value', '')
    cy.get('[data-cy="address-input"]').should('have.class', 'is-invalid')
    cy.contains('Invalid Address')
    cy.get('[data-cy="address-input"]').type('123 Fake Address Foobar, ZZ 1232')
    cy.get('[data-cy="address-input"]').should('have.class', 'is-valid')
    cy.contains('Invalid Address').should('not.exist')
  })

  it('As a borrower, I can only select a rate greater than 5 percent so that I cannot go under that percentage.', () => {
    cy.get('[data-cy="rate-input"]').should('have.value', '10')
    cy.get('[data-cy="rate-input"]').should('have.class', 'is-valid')
    cy.contains('You must set a rate greater than 5').should('not.exist')
    cy.get('[data-cy="rate-input"]')
      .clear()
      .type('5')
    cy.get('[data-cy="rate-input"]').should('have.class', 'is-invalid')
    cy.contains('You must set a rate greater than 5')
    cy.get('[data-cy="rate-input"]')
      .clear()
      .type('10')
  })

  it('As a borrower, I should be required to submit a loan amount above $50,000 so that I cannot go below this amount', () => {
    cy.get('[data-cy="loan-amount-input"]').should('have.value', '100000')
    cy.get('[data-cy="loan-amount-input"]').should('have.class', 'is-valid')
    cy.contains('We currently only allow loan amounts above $50,000').should(
      'not.exist'
    )
    cy.get('[data-cy="loan-amount-input"]')
      .clear()
      .type('49999')
    cy.get('[data-cy="loan-amount-input"]').should('have.class', 'is-invalid')
    cy.contains('We currently only allow loan amounts above $50,000')
    cy.get('[data-cy="loan-amount-input"]')
      .clear()
      .type('100000')
  })

  it('As a borrower, the form should be enabled after completing the required fields so that I can submit the data.', () => {
    cy.get('[data-cy="submit-button"]').should('be.enabled')
  })
})
