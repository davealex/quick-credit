const { Pool } = require('pg');
const logger = require('../config/winston');
const { DATABASE_URL } = require('../config/app');

const db = new Pool({
  connectionString: DATABASE_URL,
});

/**
 * Drop Reflection Table
 */
const dropLoansTable = () => {
  const queryText = 'DROP TABLE IF EXISTS loans CASCADE';
  db.query(queryText)
    .then(() => {
      logger.info({ message: 'loans table dropped' });
      // db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users CASCADE';
  db.query(queryText)
    .then(() => {
      logger.info({ message: 'user table dropped' });
      // db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};

const dropRepaymentsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS repayments CASCADE';
  db.query(queryText)
    .then(() => {
      logger.info({ message: 'repayments table dropped' });
      // db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};

dropLoansTable();
dropUserTable();
dropRepaymentsTable();
