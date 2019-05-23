// const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');
const logger = require('../../../config/winston');
const app = require('../../../src/server');

chai.use(chaiHttp);

// tests for valid and invalid req bodies:
describe('User sign in', () => {
  it('Should login a valid user', (done) => {
    // mock valid user input
    const newUser = {
      email: 'james@email.com',
      password: 'secret',
    };
    // send request to the app
    chai.request(app).post('/api/v1/auth/signin')
      .send(newUser)
      .then((res) => {
        expect(res).to.have.status(200);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });

  it('Should not login invalid credentials', (done) => {
    // mock valid user input
    const newUser = {
      email: 'john@doe.com',
      password: 'secret-shh]',
    };
    // send request to the app
    chai.request(app).post('/api/v1/auth/signin')
      .send(newUser)
      .then((res) => {
        expect(res).to.have.status(403);
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });

  it('Should fail to login ', (done) => {
    // mock valid user input
    const newUser = {

    };
    // send request to the app
    chai.request(app).post('/api/v1/auth/signin')
      .send(newUser)
      .then((res) => {
        expect(res).to.have.status(422);
        expect(res.body.error.length).to.be.greaterThan(0);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
