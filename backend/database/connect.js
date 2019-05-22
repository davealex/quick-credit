const { Pool } = require('pg');
const logger = require('../config/winston');
const { DATABASE_URL } = require('../config/app');

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  logger.info({ message: 'connected to the db' });
});


module.exports = {

  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  end: () => pool.end(),
};
