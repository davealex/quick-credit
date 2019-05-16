const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');
const loans = require('../../../seeds/loans');

const app = require('../../../src/server');

chai.use(chaiHttp);

// Test for valid registration
describe('Admin Loan Application Approval', () => {
  it('Should check if update is successful', (done) => {
    // mock valid user input
    const loanApplication = loans[0];
    loanApplication.status = 'approved';
    // send request to the app
    chai.request(app).patch(`/api/v1/loans/${loanApplication.id}`)
      .send(loanApplication)
      .then((res) => {
        // assertions
        expect(res).to.have.status(200);
        expect(loanApplication.status).to.be.equal('approved');
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
    const status = 'rejected';

    // send request to the app
    chai.request(app).patch(`/api/v1/loans/${loanApplication.id}`)
      .send(status)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.error.length).to.be.greaterThan(0);
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
