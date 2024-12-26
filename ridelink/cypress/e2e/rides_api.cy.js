describe('Rides API Tests', () => {
    const apiBaseUrl = 'https://ridelink-public.vercel.app/api/rides';
  
    it('Should fetch rides', () => {
      cy.request('GET', apiBaseUrl).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  
    // it('Should create a new ride', () => {
    //   cy.request('POST', apiBaseUrl, {
    //     createdBy: 'rider',
    //     rider: 'testRiderId',
    //     origin: 'West Lafayette',
    //     destination: 'Purdue University',
    //   }).then((response) => {
    //     expect(response.status).to.eq(201);
    //     expect(response.body).to.have.property('origin', 'West Lafayette');
    //   });
    // });
  
    // it('Should update a ride', () => {
    //   cy.request('PATCH', apiBaseUrl, {
    //     rideId: 'existingRideId',
    //     destination: 'Updated Destination',
    //   }).then((response) => {
    //     expect(response.status).to.eq(200);
    //     expect(response.body).to.have.property('destination', 'Updated Destination');
    //   });
    // });
  
    // it('Should delete a ride', () => {
    //   cy.request('DELETE', `${apiBaseUrl}?rideId=testRideId`).then((response) => {
    //     expect(response.status).to.eq(200);
    //     expect(response.body.message).to.eq('Ride deleted successfully');
    //   });
    // });
  });
  