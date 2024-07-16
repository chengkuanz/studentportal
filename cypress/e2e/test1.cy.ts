describe('template spec', () => {
  it('opening website', () => {
  cy.visit('http://localhost:3000/')
    cy.contains('Language Learning Student Portal');


})
  it('should log in with correct credentials', () => {
    // Fill in email and password inputs
    cy.visit('http://localhost:3000/login')
    cy.get('input[type="email"]').type('rashin@gmail.com');
    cy.get('input[type="password"]').type('qwe123');

    // Click on submit button
    cy.get('button[type="submit"]').click();

    // Assert that after successful login, it redirects to /dashboard
    cy.url().should('include', '/dashboard');
  });
  // cypress/integration/courseList.spec.js

  describe('CourseList Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/registerCourses'); // Replace with your actual course list page URL
    });

    it('should fetch and display courses correctly', () => {
      // Wait for courses to load
      cy.contains('Loading...').should('not.exist');

      // Check if courses are displayed correctly
      cy.get('.cards-container .row .card').should('have.length.greaterThan', 0);

      // Verify each course card
      cy.get('.cards-container .row .card').each(($card, index) => {
        // Check course name
        cy.wrap($card).find('.card-block h6').should('not.be.empty');

        // Check course code
        cy.wrap($card).find('.card-block h2 span').should('not.be.empty');

        // Check day of week
        cy.wrap($card).find('.card-block p').eq(0).should('contain', 'Day: ');

        // Check time
        cy.wrap($card).find('.card-block p').eq(1).should('contain', 'Time: ');

        // Check register link
        cy.wrap($card).find('.card-block a.btn-primary').should('contain', 'Register');
      });
    });

    it('should navigate to register page when Register button is clicked', () => {
      // Wait for courses to load
      cy.contains('Loading...').should('not.exist');

      // Click the first register button
      cy.get('.cards-container .row .card').first().find('a.btn-primary').click();

      // Check if navigation happened correctly
      cy.url().should('include', '/registerCourses/');

      // Optionally, you can add assertions to verify specific content on the register page if needed
      cy.contains('Register for Course').should('exist');
    });

    // Additional test scenarios can be added as needed
  });

})