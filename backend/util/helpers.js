const jwt = require('jsonwebtoken');
const { hashSync, compareSync } = require('bcrypt');

const { JWT_KEY } = require('../config/app');

exports.generateToken = email => jwt.sign({ email }, JWT_KEY, { expiresIn: '1h' });

exports.hash = password => hashSync(password, 10);

exports.validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

exports.validateRequiredFields = (fields, requests, error) => {
  fields.forEach((value) => {
    if (!(value in requests)) {
      error.push({
        [value]: `The ${value} field is required`,
      });
    }
  });
};

exports.compare = (pass, hash) => compareSync(pass, hash);
