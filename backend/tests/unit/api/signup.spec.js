const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const uuidv4 = require('uuid/v4');
// const { Pool } = require('pg');
const logger = require('../../../config/winston');
const app = require('../../../src/server');
// const { DATABASE_URL, TEST_DB_URL } = require('../../../config/app');

chai.use(chaiHttp);

const db = require('./../../../database/connect');

// Test for valid registration
describe('User signup', () => {
  before((done) => {
    const deleteQuery = 'DELETE FROM users WHERE email=$1 returning *';
    db.query(deleteQuery, ['james@email.com'])
      .then(() => {
        done();
      }).catch(err => logger.error({ message: err.message }));
  });

  it('Should return 201 and confirmation of valid input', (done) => {
    // mock valid user input
    const newUser = {
      id: uuidv4(),
      email: 'dave@email.com',
      firstName: 'James',
      lastName: 'Bond',
      password: 'myPassword',
      confirmPassword: 'myPassword',
      address: '133, Arlington drive, fortnort',
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
      .catch(err => logger.error({ message: err.message }));
  });
});
