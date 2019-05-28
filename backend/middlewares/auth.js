const { verify } = require('jsonwebtoken');
const { ENV, JWT_KEY } = require('../config/app');
const db = require('../database/connect');
const logger = require('../config/winston');

module.exports = (req, res, next) => {
  if (ENV === 'test') return next();
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  return verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: 'You are not signed in' });
    }

    db.query('SELECT * FROM users WHERE email = $1', [decoded.email])
      .then((resp) => {
        [req.user] = resp.rows;
        return next();
      }).catch(() => {
        logger.error({ message: err.message });
      });
  });
};
