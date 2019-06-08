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

describe('View Specific Loan', () => {
  it('Should get a specific loan', (done) => {
    chai.request(app).get(`/api/v1/loans/${loan.id}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.id).to.be.equal(loan.id);
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
