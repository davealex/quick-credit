const { jwt } = require('jsonwebtoken');
const config = require('../config/app');

module.exports = (req, res, next) => {
  // if (req.headers.is_admin === true) next();
  // return res.status(400).json({
  //   status: 400,
  //   error: 'You do not have authorization for this action',
  // });

  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  return jwt.verify(token, config.JWT_KEY, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    res.status(200).send(decoded);
    return next();
  });
};
