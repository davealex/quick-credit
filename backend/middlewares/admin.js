module.exports = (req, res, next) => {
  if (!req.body.user || !req.body.user.is_admin) {
    return res.status(403).send({
      status: 403,
      error: 'you must be logged in to use this app',
    });
  }

  return next();
};
