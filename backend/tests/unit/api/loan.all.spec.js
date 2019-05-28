const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');

const app = require('../../../src/server');

chai.use(chaiHttp);


describe('All Loans', () => {
  it('Should get all loans', (done) => {
    chai.request(app).get('/api/v1/loans').set('is_admin', true)
      .then((res) => {
        expect(res).to.have.status(200);

        done();
      })
      // .catch(err => console.log(err));
      .catch(err => logger.error({ message: err.message }));
  });
});
