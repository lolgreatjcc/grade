describe('generateManually', () => {
  it('Passed: Generating Sheets Manually', () => {
    const downloadsFolder = Cypress.config('downloadsFolder')
    const path = require('path');
    
    // Redirects user to /generate page from the landing page.
    cy.visit('http://localhost:3000')
    cy.get('#__next svg[stroke="#ffffff"]').click();
    cy.wait(1000)
    cy.get('#__next div.m-3 h1.menu-module__noSqeG__menuItemText').click();
    cy.get('#__next h1.GenerateOverlay-module__JwmcTG__overlayManuallyText').click();
    
    
    // Checks if all uneditable components are present and visible.
    cy.get('#__next div.pr-4 h1.font-bold').should('be.visible');
    cy.get('#__next div.pb-2 h1.col-span-4').should('be.visible');
    cy.get('#__next div:nth-child(3) > h1.col-span-4').should('be.visible');
    cy.get('#__next div:nth-child(4) h1.col-span-4').should('be.visible');
    cy.get('#__next div.pb-12 h1.col-span-4').should('be.visible');
    cy.get('#__next div:nth-child(2) h1.font-bold').should('be.visible');
    cy.get('#__next div:nth-child(2) div:nth-child(2) h1.pr-5').should('be.visible');
    cy.get('#__next div.py-5 h1.pr-5').should('be.visible');
    cy.get('#__next h1.mr-5').scrollIntoView()
    cy.get('#__next h1.mr-5').should('be.visible');
    cy.get('#__next img.\\!relative').should('be.visible');
    cy.get('#__next h1.max-h-1\\/12').should('be.visible');
    cy.get('#__next div.items-center h1.text-center').should('be.visible');
    cy.get('#__next div.items-center div:nth-child(1) svg').should('be.visible');
    cy.get('#__next div.index-module__-A4s8q__generateButton').should('be.visible');
    
    
    // Asserts current preview
    cy.wait(200);
    cy.get('#__next img.\\!relative').should('be.visible');
    cy.get('#__next img.\\!relative').invoke('attr', 'src').as('originalSrc')
    
    // Checks if header input components are editable and edits them to new values.
    cy.get('#__next div.pr-4 h1.font-bold').scrollIntoView();
    cy.get('#__next input[value="NATIONAL UNIVERSITY OF SINGAPORE"]').clear().type("Cypress");
    cy.get('#__next input[value="CS2100 - COMPUTER ORGANISATION"]').clear().type("Generate Unit Test");
    cy.get('#__next input[value="(Semester 1: AY2024/25)"]').clear().type('Orbital 2026');
    cy.get('#__next input[value="Time Allowed: 2 Hours"]').clear().type('Time Allowed: 1 Month');
    cy.get('#__next input[max="40"]').clear().type("5");
    cy.get('#__next div:nth-child(4) h1.Options-module__OBrjnG__option').click();
    
    // Asserts new preview
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