const { hash } = require('../util/helpers');
const User = require('../models/User');

module.exports = [
  new User(
    {
      id: 1,
      email: 'james@email.com',
      firstName: 'James',
      lastName: 'Bond',
      password: hash('myPassword'),
      address: '133, Arlington drive, fortnort',
      status: 'verified',
      isAdmin: true,
    },
  ),
  new User(
    {
      id: 2,
      email: 'laracroft@email.yo',
      firstName: 'Lara',
      lastName: 'Croft',
      password: hash('myPassword2'),
      address: '111, Red-cliff avenue, Wellington',
      status: 'unverified',
      isAdmin: true,
    },
  ),
];
