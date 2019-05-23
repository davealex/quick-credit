// const { describe } = require('mocha');
const uuidv4 = require('uuid/v4');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');
const logger = require('../../../config/winston');
const app = require('../../../src/server');

chai.use(chaiHttp);
const db = require('./../../../database/connect');

const { hash } = require('./../../../util/helpers');

function setUpUser() {
  const text = `INSERT INTO
        users(id, email, firstname, lastname, password, address, status, is_admin, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning *`;

  const values = [
    uuidv4(),
    'bar@m.com',
    'eni',
    'bennie',
    hash('secret'),
    'home address',
    'unverified',
    false,
    new Date(),
    new Date(),
  ];

  db.query(text, values)
    .then(() => {
      // console.log(resp.rows);
    })
    .catch(err => logger.error({ message: err.message }));
}

// tests for valid and invalid req bodies:
describe('User sign in', () => {
  before((done) => {
    setUpUser();
    done();
  });

  it('Should login a valid user', (done) => {
    // mock valid user input
    const newUser = {
      email: 'bar@m.com',
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
