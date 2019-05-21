const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);


describe('Loan Application', () => {
  it('Should be able to apply for a loan', (done) => {
    // mock valid user input
    const newLoan = {
      firstName: 'Dave',
      lastName: 'Snowden',
      email: 'john@wick.com',
      tenor: 12,
      amount: 15000,
    };

    // send request to the app
    chai.request(app).post('/api/v1/loans')
      .send(newLoan)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body.data.firstName).to.be.equal(newLoan.firstName);
        expect(res.body.data.lastName).to.be.equal(newLoan.lastName);
        expect(res.body.data.email).to.be.equal(newLoan.email);
        expect(res.body.data.tenor).to.be.equal(newLoan.tenor);
        expect(res.body.data.amount).to.be.equal(newLoan.amount);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });

  it('Should not create a loan resource without request fields', (done) => {
    const newLoan = {};

    chai.request(app).post('/api/v1/loans')
      .send(newLoan)
      .then((res) => {
        expect(res).to.have.status(422);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
