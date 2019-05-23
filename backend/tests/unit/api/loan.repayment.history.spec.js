// const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);

describe('All Loans', () => {
  it('Should get loan repayment history ', (done) => {
    const loanHistory = {
      loanId: 2,
    };

    chai.request(app).get(`/api/v1/loans/${loanHistory.loanId}/repayments`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        const { data } = res.body;

        data.forEach((loan) => {
          expect(loan.loanid).to.be.equal(loanHistory.loanId);
        });

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
