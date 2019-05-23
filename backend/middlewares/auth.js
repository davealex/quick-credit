const { jwt } = require('jsonwebtoken');
const config = require('../config/app');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  return jwt.verify(token, config.JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: 'You are signed in' });
    }
    req.body.user = decoded;


    return next();
  });
};
