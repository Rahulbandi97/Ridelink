describe("Dashboard Features", () => {
  it("should display Passenger Dashboard correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/passenger/dashboard");
    cy.contains("Passenger Dashboard").should("be.visible");
  });

  it("should display Driver Dashboard correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/drivers/dashboard");
    cy.contains("Driver Dashboard").should("be.visible");
  });

  it("should redirect to Sign In page when user is not logged in", () => {
    cy.visit("https://ridelink-public.vercel.app/");
    cy.get("button").contains("Get Started").click();
    cy.url().should("not.include", "/dashboard");
    cy.contains("Sign in to RideLink").should("be.visible");
  });

  it("should redirect to the Sign In page when not authenticated for ride link", () => {
    cy.visit("https://ridelink-public.vercel.app/passenger/dashboard");
    cy.url().should("include", "/sign-in");
    cy.contains("Sign in to RideLink").should("be.visible");
  });

  it("should redirect to the Sign In page when not authenticated for drive link", () => {
    cy.visit("https://ridelink-public.vercel.app/drivers/dashboard");
    cy.url().should("include", "/sign-in");
    cy.contains("Sign in to RideLink").should("be.visible");
  });
});
