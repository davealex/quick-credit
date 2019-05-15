const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');
const loans = require('../../../seeds/loans');
const app = require('../../../src/server');

chai.use(chaiHttp);

describe('View Specific Loan', () => {
  it('Should get a specific loan', (done) => {
    const loan = loans[0];
    chai.request(app).get(`/api/v1/loans/${loan.id}/`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(loans).to.deep.include(loan);
        expect(res.body.data.id).to.be.equal(loan.id);
        expect(res.body.data.user).to.be.equal(loan.user);

        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});