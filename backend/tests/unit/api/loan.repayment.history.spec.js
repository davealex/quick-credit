const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);


describe('All Loans', () => {
  it('Should get loan repayment history ', (done) => {
    const loanHistory = {
      loanId: 3,
      createdOn: new Date(),
      monthlyInstallment: 333.22,
      amount: 499.99,
    };

    chai.request(app).get(`/api/v1/loans/${loanHistory.loanId}/repayments`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.loanId).to.be.equal(loanHistory.loanId);
        expect(res.body.data.monthlyInstallment).to.be.equal(loanHistory.monthlyInstallment);
        expect(res.body.data.amount).to.be.equal(loanHistory.amount);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
