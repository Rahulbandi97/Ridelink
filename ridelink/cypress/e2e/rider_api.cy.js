// describe('Rider API Tests', () => {
//     const apiBaseUrl = 'https://ridelink-public.vercel.app/api/rider'; // Replace with actual API base URL
  
//     it('Should fetch a rider by clerkId', () => {
//       cy.request('GET', `${apiBaseUrl}?clerkId=testClerkId`).then((response) => {
//         cy.log(response.body);
//         expect(response.status).to.eq(200);
//         expect(response.body).to.have.property('clerkId', 'testClerkId');
//       });
//     });
  
//     it('Should create a new rider', () => {
//       cy.request('POST', apiBaseUrl, {
//         clerkId: 'newClerkId',
//         vehicleDetails: 'Tesla Model 3',
//         availability: 'Weekdays',
//         ratings: [4, 5],
//         status: 'Active',
//         verified: true,
//       }).then((response) => {
//         expect(response.status).to.eq(201);
//         expect(response.body).to.have.property('clerkId', 'newClerkId');
//       });
//     });
  
//     it('Should update an existing rider', () => {
//       cy.request('PATCH', apiBaseUrl, {
//         clerkId: 'existingClerkId',
//         vehicleDetails: 'Updated Vehicle Details',
//       }).then((response) => {
//         expect(response.status).to.eq(200);
//         expect(response.body).to.have.property('vehicleDetails', 'Updated Vehicle Details');
//       });
//     });
  
//     it('Should delete a rider by clerkId', () => {
//       cy.request('DELETE', `${apiBaseUrl}?clerkId=testClerkId`).then((response) => {
//         expect(response.status).to.eq(200);
//         expect(response.body.message).to.eq('Rider deleted successfully');
//       });
//     });
//   });
  