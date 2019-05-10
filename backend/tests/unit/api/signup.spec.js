const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);

// Test for valid registration
describe('User signup', () => {
  it('Should return 200 and confirmation of valid input', (done) => {
    // mock valid user input
    const newUser = {
      firstName: 'James',
      lastName: 'Bond',
      password: 'myPassword',
      confirmPassword: 'myPassword',
      email: 'james@email.com',
      homeAddress: '133, Arlington drive, fortnort',
      workAddress: '133, Arlington drive, fortnort',
    };
    // send request to the app
    chai.request(app).post('/api/v1/auth/signup')
      .send(newUser)
      .then((res) => {
        // assertions
        expect(res).to.have.status(201);
        done();
      })
      .catch((err) => {
        logger.error({ message: err.message });
      });
  });
});

// Test for invalid registration:
it('Should fail if data is not sent', (done) => {
// mock invalid user input
  const newUser = {};

  // send request to the app
  chai.request(app).post('/api/v1/auth/signup')
    .send(newUser)
    .then((res) => {
      expect(res).to.have.status(422);
      expect(res.body.error.length).to.be.greaterThan(0);
      done();
    })
    .catch((err) => {
      logger.error({ message: err.message });
    });
});
