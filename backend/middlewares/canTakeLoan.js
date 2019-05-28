const db = require('../database/connect');
const { ENV } = require('../config/app');

module.exports = (req, res, next) => {
  if (ENV === 'test') return next();
  const { email } = req.user;
  const text = 'SELECT * FROM loans WHERE email= $1 AND repaid= $2';
  db.query(text, [email.trim(), false])
    .then((resp) => {
      const [data] = resp.rows;

      if (data) {
        return res.status(403).json({
          status: 403,
          error: 'you have an unpaid loan',
        });
      }
    })
    .catch(() => res.status(400).json({
      status: 400,
      error: 'bad request',
    }));

  return next();
};
