import uuidv4 from 'uuid/v4';
// const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);

const loan = {
  id: uuidv4(),
  user: 'imogenesykes@ezentia.com',
  createdOn: '2016-02-20T01:41:03',
  status: 'rejected',
  repaid: true,
  tenor: 2,
  amount: '1,202.17',
  paymentInstallment: '2,638.64',
  balance: '1,251.44',
  interest: '3,002.22',
};


// Test for valid registration
describe('Admin Loan Application Approval', () => {
  it('Should check if update is successful', (done) => {
    // mock valid user input

    // send request to the app
    chai.request(app).patch(`/api/v1/loans/${loan.id}`)
      .send({ status: 'approved' })
      .then((res) => {
        // assertions
        expect(res).to.have.status(200);
        expect(res.body.data.status).to.be.equal('approved');
        done();
      })
      .catch((err) => {
        logger.error({ message: err.message });
      });
  });


  // Test for invalid registration:
  it('Should fail if data is not sent', (done) => {
    // mock invalid user input
    const loanApplication = '';
    // const status = 'rejected';

    // send request to the app
    chai.request(app).patch(`/api/v1/loans/${loanApplication.id}`)
      .send({ status: 'rejected' })
      .then((res) => {
        expect(res).to.have.status(400);
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
