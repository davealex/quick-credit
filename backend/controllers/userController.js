const moment = require('moment');
const uuidv4 = require('uuid/v4');
const users = require('../seeds/users');
const logger = require('../config/winston');
const db = require('../database/connect');
const {
  hash, generateToken, validateEmail, compare, validateRequiredFields,
} = require('../util/helpers');

/**
 * Sign up
 *
 *
 * @param req
 * @param res
 */
exports.signUp = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const expectedValues = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'address'];
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

  const text = `INSERT INTO
      users(id, email, firstname, lastname, password, address, status, is_admin, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;

  const values = [
    uuidv4(),
    req.body.email,
    req.body.firstName,
    req.body.lastName,
    hash(req.body.password),
    req.body.address,
    'unverified',
    false,
    moment(),
    moment(),
  ];

  db.query(text, values)
    .then((resp) => {
      const data = {
        token: generateToken(req.body.email),
        ...resp.rows[0],
      };

      delete data.password;
      return res.status(201).json({
        status: 201,
        data,
      });
    })
    .catch(err => res.status(400).send(err));
};

/**
 * Sign in
 *
 *
 * @param req
 * @param res
 */
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
  const text = 'SELECT * FROM users WHERE email = $1';

  db.query(text, [req.body.email.trim()])
    .then((resp) => {
      const data = resp.rows[0];

      if (!data) {
        return res.status(403).json({
          status: 403,
          error: 'Invalid credentials.',
        });
      }

      if (!compare(req.body.password, data.password)) {
        // console.log('invalid password')
        res.status(400).json({
          status: 400,
          error: 'Invalid password provided.',
        });
      }

      delete data.password;
      data.token = generateToken(req.body.email);

      return res.status(200).json({
        status: 200,
        data,
      });
    })
    .catch((err) => {
      // console.log(err);
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: err,
      });
    });
};

exports.verify = (req, res) => {
  const { email } = req.params;

  if (!validateEmail(email)) {
    return res.status(401).json({
      status: 401,
      error: 'The email address is invalid',
    });
  }

  const authUser = users.find(user => user.email === email);

  const {
    firstName, lastName,
  } = authUser;

  return res.status(200).json({
    status: 200,
    data: {
      email,
      firstName,
      lastName,
      status: 'verified',
    },
  });
};
