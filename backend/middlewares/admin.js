module.exports = (req, res, next) => {
  if (req.user.is_admin == 'true') {
    return next();
  }

  return res.status(403).send({
    status: 403,
    error: 'you don\'t have authorization.',
  });
};
