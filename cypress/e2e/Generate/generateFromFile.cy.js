describe('generateFromFile', () => {
  it('Passed: Generates from uploaded file', () => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    const path = require('path');
    
    cy.visit('http://localhost:3000')
    cy.get('#__next div.menu-module__noSqeG__iconContainer').click();
    cy.get('#__next div.m-3 h1.menu-module__noSqeG__menuItemText').click();
    
    // Stores current preview
    cy.wait(200);
    cy.get('#__next img.\\!relative').should('be.visible');
    
    
    // Uploads file to be tested.
    cy.get('#__next img.\\!relative').invoke('attr', 'src').as('originalSrc')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/QnA.pdf', {
      force: true,
    });
    
    // Ensures that back-end returns a response and then proceeds to click populate.
    cy.get('#__next div.self-end', { timeout: 300000 }).should('be.visible');
    cy.get('#__next div.self-end').should('be.visible');
    cy.get('#__next div.self-end').click();
    
    
    // Asserts that preview changes after Populate button is clicked.
    cy.wait(200);
    cy.get('#__next img.\\!relative').should('be.visible');
    cy.get('#__next img.\\!relative').then((originalSrc) => {
    cy.get('#__next img.\\!relative')
      .should('have.attr', 'src')
      .and('not.eq', originalSrc)
    })
    
    // Clicks Generate button and checks if file is downloaded
    cy.get('#__next h2.index-module__-A4s8q__generateButtonText').click();
    const downloadedFilename = path.join(downloadsFolder, 'file.pdf')
    cy.readFile(downloadedFilename);
    
    
    
  })
})