describe('Authentication Tests', () => {
  it('should navigate to Sign-In page and login successfully', () => {
    cy.visit('https://ridelink-public.vercel.app/sign-in');
    cy.get('input[name="username"]').type('testuser1');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard'); // Redirect after login
  });

  it('should navigate to Sign-Up page and register successfully', () => {
    cy.visit('https://ridelink-public.vercel.app/sign-up');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('input[name="confirmPassword"]').type('Password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard'); // Redirect after registration
  });
});