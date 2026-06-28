
// This test simply checks all expected components are visible on the home page.
describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    // Checks if home components are visible.
    cy.get('#__next div:nth-child(1) > div.LandingButtons-module__yJabgq__overlay > input.LandingButtons-module__yJabgq__fileInput').should('be.visible');
    cy.get('#__next div:nth-child(2) div.LandingButtons-module__yJabgq__overlay input.LandingButtons-module__yJabgq__fileInput').should('be.visible');
    
    cy.get('#__next h2.index-module__KWKY6G__tutorialBtnTxt').should('be.visible');
    cy.get('#__next h2.Logo-module__zh8txq__logoGradient').should('be.visible');
    cy.get('#__next svg[stroke="#ffffff"]').should('be.visible');
    cy.get('#__next button.LandingButtons-module__yJabgq__gradeButton').should('be.visible');
    // Checks if 'hamburger' menu works and contains both login and generate buttons. 
    cy.get('#__next path[fill="#ffffff"]').click();
    cy.get('#__next div.mb-3 h1.menu-module__noSqeG__menuItemText').should('be.visible');
    cy.get('#__next div.m-3 h1.menu-module__noSqeG__menuItemText').should('be.visible');
    
  })
})