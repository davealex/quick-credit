const { verify } = require('jsonwebtoken');
const config = require('../config/app');
const db = require('../database/connect');
const logger = require('../config/winston');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  return verify(token, config.JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: 'You are not signed in' });
    }

    db.query('SELECT * FROM users WHERE email = $1', [decoded.email])
      .then((resp) => {
        req.user = resp.rows[0];
        return next();
      }).catch((err) => {
        logger.error({ message: err.message });
      });
  });
};
