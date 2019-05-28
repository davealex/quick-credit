const { ENV } = require('../config/app');

module.exports = (req, res, next) => {
  if (ENV === 'test') return next();
  if (req.user.is_admin === 'true' || req.user.is_admin === true) {
    return next();
  }

  return res.status(403).send({
    status: 403,
    error: 'you don\'t have authorization.',
  });
};
