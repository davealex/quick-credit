const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);

describe('Loans', () => {
  it('Should get a specific loan', (done) => {
    const loan = {
      id: 1,
      user: 'user@m.com',
      createdOn: new Date().getTime(),
      status: 'verified',
      repaid: true,
      tenor: 3,
      amount: 3000.00,
      paymentInstallment: 234.12,
      balance: 12000.00,
      interest: 6.0,
    };

    chai.request(app).get(`/api/v1/loans/${loan.id}/`).set('is_admin', true)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.id).to.be.equal(loan.id);
        expect(res.body.data.user).to.be.equal(loan.user);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
