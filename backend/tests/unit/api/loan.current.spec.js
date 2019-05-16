const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);


describe('All Current Loans', () => {
  it('Should get all approved and unpaid loans', (done) => {
    chai.request(app).get('/api/v1/loans?status=approved&repaid=false')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        const { data } = res.body;
        data.forEach((loan) => {
          expect(loan.status).to.be.equal('approved');
          expect(loan.repaid).to.be.equal(false);
        });

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
