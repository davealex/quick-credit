module.exports = (req, res, next) => {
  if (req.headers.is_admin === 'true') next();
  return res.status(400).json({
    status: 400,
    error: 'You do not have authorization for this action',
  });
};
