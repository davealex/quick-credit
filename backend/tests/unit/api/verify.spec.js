// const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);

const db = require('./../../../database/connect');
const { hash } = require('./../../../util/helpers');

function setUpUser() {
  const text = `INSERT INTO
        users( firstname, lastname, email, password, homeaddress, workaddress, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        returning *`;

  const values = [
    'James',
    'Bond',
    'daveabiola@gmail.com',
    hash('secret'),
    'home address',
    'work address',
    new Date(),
    new Date(),
  ];

  db.query(text, values)
    .then(() => {
      // console.log(resp.rows);
    })
    .catch((err) => {
      logger.error({ message: err });
    });
}

// Test user verification
describe('User verification ', () => {
  before((done) => {
    setUpUser();
    done();
  });


  it('Should verify a user\'s email', (done) => {
    const user = {
      email: 'daveabiola@gmail.com',
    };

    chai.request(app).patch(`/api/v1/users/${user.email}/verify`)
      .send(user)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.email).to.be.equal(user.email);
        expect(res.body.data.status).to.be.equal('verified');
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });


  it('Should return error if an invalid email is provided', (done) => {
    const user = {
      email: 'dave',
      firstName: 'James',
      lastName: 'Bond',
    };

    chai.request(app).patch(`/api/v1/users/${user.email}/verify`).set('is_admin', true)
      .send(user)
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.be.equal('The email address is invalid');
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
