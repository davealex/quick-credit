const { Pool } = require('pg');
const logger = require('../config/winston');
const { DATABASE_URL } = require('../config/app');

const db = new Pool({
  connectionString: DATABASE_URL,
});

db.on('connect', () => {
  logger.info({ message: 'connected to the db' });
});

/**
 * Create Loans Table
 */
const createLoansTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      loans(
        id SERIAL PRIMARY KEY,
        status VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        repaid BOOLEAN NOT NULL,
        amount NUMERIC NOT NULL,
        balance VARCHAR(128) NOT NULL,
        interest VARCHAR(128) NOT NULL,
        paymentInstallment VARCHAR(128) NOT NULL,
        tenor INT NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  db.query(queryText)
    .then(() => {
      logger.info({ message: 'loans table created' });
      // db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};

/**
 * Create Repayment Table
 */
const createRepaymentTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      repayments(
        id SERIAL PRIMARY KEY,
        loanId INT NOT NULL,
        amount NUMERIC NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  db.query(queryText)
    .then(() => {
      logger.info({ message: 'repayments table created' });
      // db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        status VARCHAR(128) NOT NULL DEFAULT 'unverified',
        password VARCHAR(128) NOT NULL,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        homeAddress VARCHAR(128) NOT NULL,
        workAddress VARCHAR(128) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  db.query(queryText)
    .then(() => {
      logger.info({ message: 'user table created' });
      db.end();
    })
    .catch((err) => {
      logger.info({ message: err });
      db.end();
    });
};


createLoansTable();
createUserTable();
createRepaymentTable();
