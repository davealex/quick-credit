const moment = require('moment');
const uuidv4 = require('uuid/v4');
// const users = require('../seeds/users');
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
  if (!validateEmail(email.trim())) error.push({ email: 'The email address is not valid' });
  if (confirmPassword !== password) error.push({ confirmPassword: 'The password does not match password field' });

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });
    return;
  }

  // check if user exits
  db.query('SELECT * FROM users WHERE email = $1', [req.body.email.trim()])
    .then((resp) => {
      const user = resp.rows[0];
      if (user) {
        return res.status(400).json({
          status: 400,
          error: 'The email is taken.',
        });
      }

      // save new user
      const text = `INSERT INTO
      users(id, email, firstname, lastname, password, address, status, is_admin, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;

      const role = req.body.email.trim() === 'admin@gmail.com';

      const values = [
        uuidv4(),
        req.body.email.trim(),
        req.body.firstName,
        req.body.lastName,
        hash(req.body.password.trim()),
        req.body.address,
        'unverified',
        role,
        moment(),
        moment(),
      ];

      db.query(text, values)
        .then((resp) => {
          const data = {
            token: generateToken(req.body.email.trim()),
            ...resp.rows[0],
          };

          delete data.password;
          return res.status(201).json({
            status: 201,
            data,
          });
        })
        .catch((err) => {
          logger.error({ message: err.message });
          return res.status(400).json({
            status: 400,
            error: 'Creating a new user failed. Please try again.',
          });
        });
    })
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Authentication failed. Please try again.',
      });
    });
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

exports.verifyUser = (req, res) => {
  const { email } = req.params;

  if (!validateEmail(email)) {
    return res.status(401).json({
      status: 401,
      error: 'The email address is invalid',
    });
  }

  // find user
  let user;
  const text = 'SELECT * FROM users WHERE email = $1';
  db.query(text, [email.trim()])
    .then((resp) => {
      [user] = resp.rows;
      // console.log(user);
      if (!user) {
        return res.status(403).json({
          status: 403,
          error: 'User with id not found.',
        });
      }

      // update user status
      const updateOneQuery = `UPDATE users
      SET status=$1, updated_at=$2
      WHERE email=$3 returning *`;
      const values = [
        'verified',
        new Date(),
        email,
      ];

      db.query(updateOneQuery, values)
        .then((response) => {
          [user] = response.rows;

          return res.status(200).json({
            status: 200,
            data: {
              email,
              firstName: user.firstname,
              lastName: user.lastname,
              status: user.status,
            },
          });
        })
        .catch((err) => {
          logger.error({ message: err.message });
          return res.status(400).json({
            status: 400,
            error: 'Failed to verify user.',
          });
        });
    })
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Failed to verify user.',
      });
    });
};
