const { describe } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const logger = require('../../../config/winston');
const {
  hash,
} = require('../../../util/helpers');

const app = require('../../../src/server');

chai.use(chaiHttp);

// Test user verification
describe('User verification ', () => {
  it('Should verify a user\'s email', (done) => {
    const user = {
      id: 2,
      email: 'ninagordon@satiance.com',
      firstName: 'Cantu',
      lastName: 'Williamson',
      password: hash('myPassword2'),
      homeAddress: '920 Poplar Avenue, Kempton, Nevada, 7807',
      workAddress: '257 John Street, Woodruff, Pennsylvania, 9834',
      status: 'unverified',
      isAdmin: false,
    };

    chai.request(app).patch(`/api/v1/users/${user.email}/verify`)
      .send(user)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.email).to.be.equal(user.email);
        expect(res.body.data.firstName).to.be.equal(user.firstName);
        expect(res.body.data.lastName).to.be.equal(user.lastName);
        expect(res.body.data.status).to.be.equal('verified');
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });


  it('Should return error if an invalid email is provided', (done) => {
    const user = {
      email: 'dave',
      firstName: 'James',
      lastName: 'Bond',
    };

    chai.request(app).patch(`/api/v1/users/${user.email}/verify`).set('is_admin', true)
      .send(user)
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.be.equal('The email address is invalid');
        done();
      })
      .catch(err => logger.error({ message: err.message }));
  });
});
