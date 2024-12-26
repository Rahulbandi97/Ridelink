describe("UI Tests", () => {
  it("should display Navbar correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/");
    cy.get("nav").should("be.visible");
    cy.get('img[alt="RideLink logo').should("exist");
    cy.get("nav")
      .contains("Ride")
      .should("be.visible")
      .and("have.attr", "href", "/passenger/dashboard");
    cy.get("nav")
      .contains("Drive")
      .should("be.visible")
      .and("have.attr", "href", "/drivers/dashboard");
  });

  it("should display Footer correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/");
    cy.get("footer").should("be.visible");
    cy.get("p")
      .contains(`© ${new Date().getFullYear()} RideLink. All rights reserved.`)
      .should("exist");
    cy.get("footer")
      .contains("Book a Ride")
      .should("be.visible")
      .and("have.attr", "href", "/passenger/dashboard");
    cy.get("footer")
      .contains("Give a Ride")
      .should("be.visible")
      .and("have.attr", "href", "/drivers/dashboard");
  });

  it("should display the Google Maps iframe correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/");

    // Check if the iframe container is visible
    cy.get("div.mt-8.md\\:mt-0.md\\:flex-1").should("be.visible");

    // Check if the iframe element with the specific src is visible
    cy.get('iframe[src*="https://www.google.com/maps/embed"]').should(
      "be.visible"
    );

    // Verify iframe attributes (e.g., width and height)
    cy.get('iframe[src*="https://www.google.com/maps/embed"]')
      .should("have.attr", "width", "600")
      .and("have.attr", "height", "450");
  });
});
