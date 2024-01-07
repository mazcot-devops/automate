describe('API Tests', () => {
    const BASE_URL = 'http://localhost:3000';
    const testData = {
      username: 'testuser',
      password: 'testpass',
      newPassword: 'newpass123'
    };
  
    it('Register User', () => {
      cy.request('POST', `${BASE_URL}/register`, {
        username: testData.username,
        password: testData.password
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  
    it('Login User', () => {
      cy.request('POST', `${BASE_URL}/login`, {
        username: testData.username,
        password: testData.password
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  
    it('Update User Password', () => {
      cy.request('PUT', `${BASE_URL}/update`, {
        username: testData.username,
        newPassword: testData.newPassword
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  
    it('Delete User', () => {
      cy.request('DELETE', `${BASE_URL}/delete`, {
        username: testData.username,
        password: testData.newPassword
      }).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  
    it('Get All Users', () => {
      cy.request('GET', `${BASE_URL}/users`).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  });
  