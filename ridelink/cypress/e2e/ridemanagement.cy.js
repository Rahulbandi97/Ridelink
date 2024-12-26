describe("Ride Management", () => {
  it("should allow finding and filtering rides", () => {
    cy.intercept("GET", "/api/rides", {
      statusCode: 200,
      body: [
        {
          rideId: "1",
          origin: "Fort Wayne, Indiana, United States",
          destination: "Chicago, Illinois, United States",
          passengers: [],
          fare: 100,
          startTime: "2023-12-12T10:00:00Z",
          destinationLocation: {
            type: "Point",
            coordinates: [-87.6298, 41.8781],
          },
          startLocation: {
            type: "Point",
            coordinates: [-85.139351, 41.079273],
          },
          createdBy: "rider",
          _id: "ride1",
          __v: 0,
        },
      ],
    }).as("getRides");

    cy.visit("https://ridelink-public.vercel.app/rides/findrides");
    cy.wait("@getRides");
    cy.contains("Available Rides").should("be.visible");

    cy.get('input[placeholder="Search..."]').type("Fort Wayne");
    cy.contains("Fort Wayne, Indiana, United States").should("be.visible");
    cy.contains("Chicago, Illinois, United States").should("be.visible");
  });

  it("should allow adding a user to a ride", () => {
    cy.intercept("GET", "/api/rides", {
      statusCode: 200,
      body: [
        {
          rideId: "1",
          origin: "Fort Wayne, Indiana, United States",
          destination: "Chicago, Illinois, United States",
          passengers: [{ clerkId: "mockUserId" }],
          fare: 100,
          startTime: "2023-12-12T10:00:00Z",
          destinationLocation: {
            type: "Point",
            coordinates: [-87.6298, 41.8781],
          },
          startLocation: {
            type: "Point",
            coordinates: [-85.139351, 41.079273],
          },
          createdBy: "rider",
          status: "pending",
          _id: "ride1",
          __v: 0,
        },
      ],
    }).as("getRides");

    cy.intercept("PATCH", "/api/rides?rideId=1", {
      statusCode: 200,
      body: {
        rideId: "1",
        passengers: [{ clerkId: "mockUserId" }],
        origin: "Fort Wayne, Indiana, United States",
        destination: "Chicago, Illinois, United States",
        status: "pending",
      },
    }).as("addToRide");

    cy.visit("https://ridelink-public.vercel.app/rides/findrides");

    cy.wait("@getRides");
    cy.contains("Available Rides").should("be.visible");
    cy.contains("Fort Wayne, Indiana, United States").should("be.visible");
    cy.contains("Chicago, Illinois, United States").should("be.visible");

    cy.contains("Add me to Ride").should("be.visible").click();
    cy.wait("@addToRide");
    // cy.contains("You have been added to the ride!").should("be.visible");
  });

  it("should allow booking a ride as a passenger", () => {
    cy.intercept("GET", "https://api.mapbox.com/geocoding/v5/mapbox.places/*", {
      statusCode: 200,
      body: {
        features: [
          {
            center: [-85.139351, 41.079273],
            place_name: "Fort Wayne, Indiana, United States",
            context: [{ id: "country.1", text: "United States" }],
          },
          {
            center: [-87.6298, 41.8781],
            place_name: "Chicago, Illinois, United States",
            context: [{ id: "country.1", text: "United States" }],
          },
        ],
      },
    }).as("geocode");

    cy.intercept("POST", "/api/rides", (req) => {
      expect(req.body).to.deep.include({
        createdBy: "passenger",
        origin: "Fort Wayne, Indiana, United States",
        destination: "Chicago, Illinois, United States",
        startTime: req.body.startTime,
      });

      req.reply({
        statusCode: 201,
        body: { message: "Ride created successfully!" },
      });
    }).as("createRide");

    cy.visit("https://ridelink-public.vercel.app/rides/requestride");

    cy.get('input[placeholder="Enter pickup location"]').type("Fort Wayne");
    cy.wait("@geocode", { timeout: 5000 });
    cy.get('input[placeholder="Enter pickup location"]')
      .parent()
      .contains("Fort Wayne, Indiana, United States")
      .click();

    cy.get('input[placeholder="Enter dropoff location"]').type("Chicago");
    cy.wait("@geocode", { timeout: 5000 });
    cy.get('input[placeholder="Enter dropoff location"]')
      .parent()
      .contains("Chicago, Illinois, United States")
      .click();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateTime = `${futureDate.toISOString().split("T")[0]}T10:00`;
    cy.get('input[type="datetime-local"]').type(futureDateTime);
    cy.contains("Create Ride").click();
    cy.wait("@createRide", { timeout: 10000 });
    cy.url().should("include", "/passenger/dashboard");
  });
});
