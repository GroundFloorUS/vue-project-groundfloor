describe('UI Interactions for app with existing data', () => {
  beforeEach(() => {
    cy.exec('npm run db:reset')
    cy.exec('npm run db:seed-investment')
    cy.exec('npm run db:seed-funding')
    cy.visit('/')
  })

  it('verifies the correct data got loaded', () => {
    cy.visit('/funding')
    cy.get('.loan-card').should('have.length', 3)
    cy.get('.loan-card')
      .eq(1)
      .contains('$10,060 of $100,000')
    cy.get('.loan-card')
      .eq(2)
      .contains('$31,100 of $100,000')
      .click()

    cy.location('pathname').should('equal', '/investment/1')
    cy.get('.investment_funds .list-group-item').should('have.length', 4)

    cy.visit('/funded')
    cy.get('.loan-card').should('have.length', 1)
    cy.contains('999 Anywhere St')
  })

  it('handles the fund amount states', () => {
    cy.visit('/funding')
    cy.get('.loan-card')
      .first()
      .click()
    cy.location('pathname').should('equal', '/investment/4')

    cy.get('.investment_funds .empty-state').should('exist')
    cy.getRef('remainingAmount').contains('100,000')

    // initial amount
    cy.get('input#amount').should('have.value', 10)
    cy.getRef('remainingAfterInvestment').contains('$99,990')
    cy.getRef('initial').contains('$10')
    cy.getRef('interest').contains('$1')
    cy.getRef('return').contains('$11')
    cy.get('button')
      .contains('Submit')
      .should('be.enabled')

    // $1000
    cy.get('input#amount').type('00')
    cy.getRef('remainingAfterInvestment').contains('$99,000')
    cy.getRef('initial').contains('$1,000')
    cy.getRef('interest').contains('$53')
    cy.getRef('return').contains('$1,053')
    cy.get('button')
      .contains('Submit')
      .should('be.enabled')

    // $100000 (exact amount)
    cy.get('input#amount').type('00')
    cy.getRef('remainingAfterInvestment').contains('$0')
    cy.getRef('initial').contains('$100,000')
    cy.getRef('interest').contains('$5,250')
    cy.getRef('return').contains('$105,250')
    cy.getRef('isExactAlert').should('exist')
    cy.getRef('tooMuchAlert').should('not.exist')
    cy.get('button')
      .contains('Submit')
      .should('be.enabled')

    // $10000000 (too much)
    cy.get('input#amount').type('00')
    cy.getRef('tooMuchAlert').should('exist')
    cy.getRef('isExactAlert').should('not.exist')
    cy.get('button')
      .contains('Submit')
      .should('be.disabled')

    // reset
    cy.get('input#amount').clear()
    cy.get('button')
      .contains('Submit')
      .should('be.disabled')

    cy.get('input#amount').type('99000')
    cy.getRef('tooMuchAlert').should('not.exist')
    cy.getRef('isExactAlert').should('not.exist')
    cy.getRef('remainingAfterInvestment').contains('$1,000')
    cy.getRef('initial').contains('$99,000')
    cy.getRef('interest').contains('$5,198')
    cy.getRef('return').contains('$104,198')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    // redirects back to funding page
    cy.location('pathname').should('equal', '/funding')
    cy.get('.loan-card').should('have.length', 3)
    cy.get('.loan-card')
      .first()
      .contains('99%')
      .click()

    // navigate to the investment you funded
    cy.location('pathname').should('equal', '/investment/4')
    cy.get('.investment_funds .list-group-item').should('have.length', 1)

    // initial amount
    cy.get('input#amount').should('have.value', 10)
    cy.getRef('remainingAfterInvestment').contains('$990')
    cy.getRef('initial').contains('$10')
    cy.getRef('interest').contains('$1')
    cy.getRef('return').contains('$11')
    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
  })

  it('closes a loan', () => {
    cy.visit('/investment/4')

    cy.get('input#amount')
      .clear()
      .type('100000')
    cy.getRef('remainingAfterInvestment').contains('$0')
    cy.getRef('initial').contains('$100,000')
    cy.getRef('interest').contains('$5,250')
    cy.getRef('return').contains('$105,250')
    cy.getRef('isExactAlert').should('exist')
    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()

    // redirects back to funding page
    cy.location('pathname').should('equal', '/funding')
    cy.get('.loan-card').should('have.length', 2)
    cy.get('.loan-card')
      .first()
      .contains('541 Anywhere St')
      .click()

    // navigate to the new first investment
    cy.location('pathname').should('equal', '/investment/2')
    cy.get('.investment_funds .list-group-item').should('have.length', 3)

    // make sure the funded page has been updated
    cy.visit('/funded')
    cy.get('.loan-card').should('have.length', 2)
  })

  it('does not show progress of fully funded loans', () => {
    cy.visit('/funded')
    cy.get('.loan-card__progress').should('not.exist')
    cy.contains('Amount: $100,000').click()

    cy.location('pathname').should('equal', '/investment/3')
    cy.get('input#amount').should('not.exist')
  })
})
