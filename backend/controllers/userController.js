const users = require('../seeds/users');
const {
  generateToken, validateEmail, compare, validateRequiredFields,
} = require('../util/helpers');

exports.signUp = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const expectedValues = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'homeAddress', 'workAddress'];
  const error = [];

  // required fields validation
  validateRequiredFields(expectedValues, req.body, error);

  // extra validation
  if (!validateEmail(email)) error.push({ email: 'The email address is not valid' });
  if (confirmPassword !== password) error.push({ confirmPassword: 'The password does not match password field' });

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
    email: req.body.email,
    homeAddress: req.body.homeAddress,
    workAddress: req.body.workAddress,

  };

  res.status(201).json({
    status: 201,
    data,
  });
};

exports.signIn = (req, res) => {
  const error = [];
  const expectedValues = ['email', 'password'];

  // required fields validation
  validateRequiredFields(expectedValues, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  // authenticated user
  const authUser = users
    .filter(user => user.email === req.body.email && compare(req.body.password, user.password));

  if (authUser === [] || authUser[0] === undefined) {
    res.status(403).json({
      status: 403,
      error: 'Invalid username or password',
    });
  } else {
    res.status(200).json({
      status: 200,
      data: {
        token: generateToken(authUser[0].email),
        id: authUser[0].id,
        firstName: authUser[0].firstName,
        lastName: authUser[0].lastName,
        email: authUser[0].email,
      },
    });
  }
};

exports.verify = (req, res) => {
  const userEmail = req.params.email;

  if (!validateEmail(userEmail)) {
    return res.status(401).json({
      status: 401,
      error: 'The email address is invalid',
    });
  }

  return res.status(200).json({
    status: 200,
    data: {
      email: userEmail,
      firstName: 'James',
      lastName: 'Bond',
      status: 'verified',
    },
  });
};
