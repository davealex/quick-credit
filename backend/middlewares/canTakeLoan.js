const db = require('../database/connect');

module.exports = (req, res, next) => {
  if (!req.body.user || !req.body.user.email) {
    return res.status(403).send({
      status: 403,
      error: 'you must be logged in to use this app',
    });
  }
  const { email } = req.body.user;
  const text = `SELECT * FROM loans WHERE user = ${email} AND repaid = false`;
  db.query(text, [req.body.email.trim()])
    .then((resp) => {
      const data = resp.rows[0];

      if (data) {
        return res.status(403).json({
          status: 403,
          error: 'unrepaid loan',
        });
      }
    })
    .catch(err => res.status(400).json({
      status: 400,
      error: 'bad request',
    }));

  return next();
};
