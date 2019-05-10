const users = require('../seeds/users');
const { generateToken, hash, validateEmail } = require('../util/helpers');

exports.getAllUsers = (req, res) => {
  res.status(200).json(
    {
      status: 200,
      data: users,
    },
  );
};

exports.signUp = (req, res) => {
  const {
    firstName, lastName, email, password, confirmPassword, homeAddress, workAddress,
  } = req.body;
  const error = [];
  if (!firstName) error.push({ firstName: 'The first name field is required' });

  if (!lastName) error.push({ lastName: 'The last name field is required' });

  if (!email) error.push({ email: 'The email field is required' });

  if (!validateEmail(email)) error.push({ email: 'The email address is not valid' });

  if (!password) error.push({ password: 'The password field is required' });

  if (!confirmPassword) error.push({ confirmPassword: 'The confirm password field is required' });

  if (confirmPassword !== password) error.push({ confirmPassword: 'The password does not match password field' });

  if (!homeAddress) error.push({ homeAddress: 'The home address field is required' });

  if (!workAddress) error.push({ workAddress: 'The work address field is required' });
  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });
    return;
  }
  let id = 0;
  id += 1;
  const data = {
    token: generateToken(req.body.email),
    id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hash(req.body.password),
    confirmPassword: hash(req.body.confirmPassword),
    email: req.body.email,
    homeAddress: req.body.homeAddress,
    workAddress: req.body.workAddress,

  };

  res.status(201).json({
    status: 201,
    data,
  });
};
