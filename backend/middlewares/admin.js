module.exports = (req, res, next) => {
  if (!req.body.user || !req.body.user.is_admin) {
    return res.status(403).send({
      auth: false,
      message: 'You do not have permission to access this route',
    });
  }

  return next();
};
