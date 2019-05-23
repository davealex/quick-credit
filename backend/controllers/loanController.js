const uuidv4 = require('uuid/v4');
const db = require('../database/connect');
const loans = require('../seeds/loans');
const compute = require('../util/loanComputedValues');
const logger = require('../config/winston');
const {
  validateRequiredFields,
} = require('../util/helpers');

exports.applyForLoan = (req, res) => {
  const error = [];
  const expectedValues = ['email', 'tenor', 'amount'];

  validateRequiredFields(expectedValues, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });
    return;
  }

  // find user
  let user;
  db.query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then((resp) => {
      [user] = resp.rows;
      // console.log(user)
      if (user) logger.error({ message: user });
      return res.status(400).json({
        status: 400,
        error: 'User with email not found.',
      });
      // return user;
    }).catch((err) => {
      res.status(400).json({
        status: 400,
        error: err,
      });
    });

  const { amount, tenor } = req.body;

  const text = `INSERT INTO
      loans(id, email, repaid, tenor, amount, paymentinstallment, status, balance, interest, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *`;

  const values = [
    uuidv4(),
    req.body.email,
    false,
    req.body.tenor,
    req.body.amount,
    compute.installment(amount, 5, tenor),
    'pending',
    compute.balance(amount, 5),
    compute.balance(5, amount),
    new Date(),
    new Date(),
  ];

  db.query(text, values)
    .then((resp) => {
      const data = resp.rows[0];

      return res.status(201).json({
        status: 201,
        data: {
          loanId: data.id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          tenor: data.tenor,
          amount: Number(data.amount),
          paymentInstallment: data.paymentinstallment,
          status: data.status,
          balance: data.balance,
          interest: data.interest,
          repaid: data.repaid,
        },
      });
    })
    .catch(err => res.status(400).json({
      status: 400,
      errors: err,
    }));
};

exports.show = (req, res) => {
  const { loanId } = req.params;

  if (loanId !== '' && loanId !== null && (loans.some(loan => loan.id === Number(loanId)))) {
    const specificLoan = loans.find(loan => Number(loanId) === loan.id);

    return res.status(200).json({
      status: 200,
      data: specificLoan,
    });
  }

  return res.status(404).json({
    status: 404,
    error: 'record not found',
  });
};

exports.index = (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.query, 'status') && Object.prototype.hasOwnProperty.call(req.query, 'repaid')) {
    if (req.query.status === 'approved' && req.query.repaid === 'true') {
      const paidLoans = loans.filter(paid => paid.status === 'approved' && paid.repaid === true);
      return res.status(200)
        .json({
          status: 200,
          data: paidLoans,
        });
    }

    if (req.query.status === 'approved' && req.query.repaid === 'false') {
      const currentLoans = loans.filter(paid => paid.status === 'approved' && paid.repaid === false);
      return res.status(200)
        .json({
          status: 200,
          data: currentLoans,
        });
    }
  }

  return res.status(200).json({
    status: 200,
    data: loans,
  });
};

exports.repayments = (req, res) => {
  const { loanId } = req.params;

  const findQuery = 'SELECT * FROM repayments WHERE loanid= $1';
  db.query(findQuery, [loanId.trim()])
    .then((resp) => {
      const data = resp.rows;

      return res.status(200).json({
        status: 200,
        data,
      });
    }).catch(err => res.status(400).json({
      status: 400,
      error: err,
    }));
};

exports.update = (req, res) => {
  const { loanId } = req.params;

  const error = [];
  const expectedValue = ['status'];

  validateRequiredFields(expectedValue, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  if (loanId.trim() !== '' && loanId.trim() !== null && (loans.some(loan => loan.id === Number(loanId)))) {
    const specificLoan = loans.find(loan => Number(loanId) === loan.id);

    if (!('status' in req.body)) {
      res.status(422).json({
        status: 422,
        error: 'Invalid input value',
      });

      return;
    }

    res.status(200).json({
      status: 200,
      data: {
        loanId: specificLoan.id,
        loanAmount: specificLoan.amount,
        tenor: specificLoan.tenor,
        status: req.body.status, // approved or rejected
        monthlyInstallment: specificLoan.paymentInstallment,
        interest: specificLoan.interest,
      },
    });
  } else {
    res.status(404).json({
      status: 404,
      error: 'record not found',
    });
  }
};

exports.createRepayment = (req, res) => {
  const { loanId } = req.params;
  const error = [];
  const expectedValue = ['loanId', 'amount'];

  validateRequiredFields(expectedValue, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  if (loans.some(loan => loan.id === Number(loanId))) {
    const specificLoan = loans.find(loan => Number(loanId) === loan.id);
    res.status(200).json({
      status: 200,
      data: {
        id: 2,
        loanId: Number(specificLoan.id),
        createdOn: new Date().getTime(),
        amount: specificLoan.amount,
        monthlyInstallment: specificLoan.paymentInstallment,
        paidAmount: req.body.paidAmount,
        balance: specificLoan.balance - req.body.balance,
      },
    });
  }

  res.status(404).json({
    status: 404,
    error: 'record not found',
  });
};
