const uuidv4 = require('uuid/v4');
const logger = require('../config/winston');
const db = require('../database/connect');
const { hash } = require('../util/helpers');

const makeUser = () => {
  const text = `INSERT INTO
      users(id, firstname, lastname, email, password, address, status, is_admin, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;

  const values = [
    uuidv4(),
    'James',
    'Bond',
    'james@email.com',
    hash('secret'),
    '123, Arlington drive, fortnort',
    'verified',
    'false',
    new Date(),
    new Date(),
  ];

  db.query(text, values)
    .then(() => {
      // console.log('created test user: james@email.com');
    })
    .catch((err) => {
      logger.error({ message: err.message });
    });
};

makeUser();
