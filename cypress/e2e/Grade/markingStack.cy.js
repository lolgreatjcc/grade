describe('markingStack', () => {
  it('Passed: Marking Stack', () => {
    cy.visit('localhost:3000')
    cy.wait(500);
    
    cy.get('#__next div:nth-child(1) > div.LandingButtons-module__yJabgq__overlay > input.LandingButtons-module__yJabgq__fileInput')
      .selectFile('cypress/fixtures/QnA.pdf', {
        force: true,
      });
    cy.get('#__next div:nth-child(2) div.LandingButtons-module__yJabgq__overlay input.LandingButtons-module__yJabgq__fileInput')
      .selectFile('cypress/fixtures/AnswerKey.pdf', {
        force: true,
      });
    
    cy.wait(1000);
    cy.get('#__next button.LandingButtons-module__yJabgq__gradeButton').click();
    
    // Checks if exit button exists
    cy.get('#__next h1.ms-3', {timeout: 60000}).should('be.visible');
    // Checks Markbody
    cy.get('#__next div:nth-child(1) > div.MarkSection-module__9dj5tW__markBody').should('be.visible');
    // Checks Claude and ChatGPT Buttons
    cy.get('#__next div:nth-child(1) > div.MarkSection-module__9dj5tW__markBody > div.justify-end > div.items-end > svg.MarkSection-module__9dj5tW__claude > path').should('be.visible');
    cy.get('#__next div:nth-child(1) > div.MarkSection-module__9dj5tW__markBody > div.justify-end > div.items-end > svg.MarkSection-module__9dj5tW__chatgpt').should('be.visible');
    // Checks Navigation
    cy.get('#__next svg.index-module__VrG_Aa__quizNavigation').should('be.visible');
    cy.get('#__next h1.index-module__VrG_Aa__quizNavText').should('be.visible');
    cy.get('#__next path[d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"]').should('be.visible');
    // Checks if tooltips exist
    cy.get('#__next div.relative div:nth-child(2)', {timeout: 12000}).should('be.visible');
    
    // Checks if successfully redirected to ChatGPT
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake((url) => {
        return win.open.wrappedMethod.call(win, url, '_self');
      }).as('windowOpen');
    });
    cy.get('#__next div:nth-child(1) > div.MarkSection-module__9dj5tW__markBody > div.justify-end > div.items-end > svg.MarkSection-module__9dj5tW__chatgpt').click();
    cy.get('@windowOpen').should('be.called');
    cy.url().should('include', 'chatgpt.com');
    
    
  })
})