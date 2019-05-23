const { hash } = require('../util/helpers');
// const User = require('../models/User');

// module.exports = [
//   new User(
//     {
//       id: 1,
//       email: 'james@email.com',
//       firstName: 'James',
//       lastName: 'Bond',
//       password: hash('myPassword'),
//       address: '133, Arlington drive, fortnort',
//       status: 'verified',
//       isAdmin: true,
//     },
//   ),
//   new User(
//     {
//       id: 2,
//       email: 'laracroft@email.yo',
//       firstName: 'Lara',
//       lastName: 'Croft',
//       password: hash('myPassword2'),
//       address: '111, Red-cliff avenue, Wellington',
//       status: 'unverified',
//       isAdmin: true,
//     },
//   ),
// ];

module.exports = [
  {
    id: 8,
    email: 'camachoshaffer@satiance.com',
    firstName: 'Kaitlin',
    lastName: 'Pace',
    password: hash('myPassword2'),
    address: '793 Marconi Place, Canoochee, Marshall Islands, 1965',
    status: 'verified',
    isAdmin: false,
  },
  {
    id: 39,
    email: 'daveabiola@gmail.com',
    firstName: 'Nina',
    lastName: 'Gordon',
    password: hash('secret'),
    address: '821 Desmond Court, Logan, New Jersey, 5782',
    status: 'verified',
    isAdmin: true,
  },
  {
    id: 2,
    email: 'ninagordon@satiance.com',
    firstName: 'Cantu',
    lastName: 'Williamson',
    password: hash('myPassword2'),
    address: '920 Poplar Avenue, Kempton, Nevada, 7807',
    status: 'unverified',
    isAdmin: false,
  },
  {
    id: 25,
    email: 'cantuwilliamson@satiance.com',
    firstName: 'Fuller',
    lastName: 'Mcfadden',
    password: hash('myPassword2'),
    address: '608 Glendale Court, Whipholt, Guam, 2454',
    status: 'verified',
    isAdmin: true,
  },
  {
    id: 12,
    email: 'fullermcfadden@satiance.com',
    firstName: 'Woodward',
    lastName: 'Tate',
    password: hash('myPassword2'),
    address: '646 Seagate Terrace, Williston, Montana, 3329',
    status: 'unverified',
    isAdmin: true,
  },
  {
    id: 31,
    email: 'woodwardtate@satiance.com',
    firstName: 'Daniel',
    lastName: 'Shields',
    password: hash('myPassword2'),
    address: '389 Madeline Court, Echo, New Hampshire, 5197',
    status: 'unverified',
    isAdmin: false,
  },
];
