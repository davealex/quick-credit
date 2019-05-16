const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');
const loans = require('../../../seeds/loans');

const app = require('../../../src/server');

chai.use(chaiHttp);


describe('Loan Repayment', () => {
  it('Invalid request', (done) => {
    const loan = loans[0];
    chai.request(app).post(`/api/v1/loans/${loan.loanId}/repayment`)
      .send(loan)
      .then((res) => {
        expect(res).to.have.status(422);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
