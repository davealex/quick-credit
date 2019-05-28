const uuidv4 = require('uuid/v4');
const db = require('../database/connect');
// const loans = require('../seeds/loans');
const compute = require('../util/loanComputedValues');
const logger = require('../config/winston');
const {
  validateRequiredFields, isNumeric, isAlpha,
} = require('../util/helpers');

exports.applyForLoan = (req, res) => {
  const error = [];
  const expectedValues = ['tenor', 'amount'];

  validateRequiredFields(expectedValues, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });
    return;
  }

  const { amount, tenor } = req.body;
  const { user } = req;

  const text = `INSERT INTO
      loans(id, email, repaid, tenor, amount, paymentinstallment, status, balance, interest, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *`;

  const values = [
    uuidv4(),
    req.user.email,
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
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Failed while applying for a loan.',
      });
    });
};

exports.showLoan = (req, res) => {
  const { loanId } = req.params;

  let loan;
  const findOneQuery = 'SELECT * FROM loans WHERE id=$1';
  db.query(findOneQuery, [loanId.trim()])
    .then((resp) => {
      [loan] = resp.rows;
      // console.log('loan is:', loan);
      if (!loan) {
        return res.status(400).json({
          status: 400,
          error: 'Loan not found.',
        });
      }

      return res.status(200).json({
        status: 200,
        data: loan,
      });
    })
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Loan not found.',
      });
    });
};

exports.index = (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.query, 'status') && Object.prototype.hasOwnProperty.call(req.query, 'repaid')) {
    const findQuery = 'SELECT * FROM loans WHERE status= $1 AND repaid= $2';
    db.query(findQuery, [req.query.status.trim(), req.query.repaid])
      .then((resp) => {
        const data = resp.rows;

        return res.status(200).json({
          status: 200,
          data,
        });
      })
      .catch(err => res.status(400).json({
        status: 400,
        error: err,
      }));
  } else {
    const findQuery = 'SELECT * FROM loans';
    db.query(findQuery)
      .then((resp) => {
        const data = resp.rows;

        return res.status(200)
          .json({
            status: 200,
            data,
          });
      })
      .catch(
        err => res.status(400).json({
          status: 400,
          error: err,
        }),
      );
  }
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

  isAlpha(expectedValue, req.body, error);
  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  // find loan
  let loan;
  const findOneQuery = 'SELECT * FROM loans WHERE id=$1';
  db.query(findOneQuery, [loanId.trim()])
    .then((resp) => {
      [loan] = resp.rows;
      if (!loan) {
        return res.status(404).json({
          status: 404,
          error: 'loan not found',
        });
      }

      // update loan
      const updateOneQuery = `UPDATE loans
      SET status=$1, updated_at=$2
      WHERE id=$3 returning *`;
      const values = [
        req.body.status.trim(),
        new Date(),
        loanId.trim(),
      ];

      db.query(updateOneQuery, values)
        .then((respp) => {
          [loan] = respp.rows;

          return res.status(200).json({
            status: 200,
            data: {
              loanId: loan.id,
              loanAmount: loan.amount,
              tenor: loan.tenor,
              status: loan.status,
              monthlyInstallment: loan.paymentinstallment,
              interest: loan.interest,
              balance: loan.balance,
            },
          });
        })
        .catch((err) => {
          logger.error({ message: err.message });
          return res.status(400).json({
            status: 400,
            error: 'Failed to update loan.',
          });
        });
    })
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Failed to update loan',
      });
    });
};

exports.createRepayment = (req, res) => {
  const { loanId } = req.params;
  const error = [];
  const expectedValue = ['amount'];

  validateRequiredFields(expectedValue, req.body, error);
  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  isNumeric(expectedValue, req.body, error);
  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });

    return;
  }

  // find loan
  let loan;
  const findOneQuery = 'SELECT * FROM loans WHERE id=$1';
  db.query(findOneQuery, [loanId.trim()])
    .then((resp) => {
      [loan] = resp.rows;
      // console.log('loan is:', loan);
      if (!loan) {
        return res.status(404).json({
          status: 404,
          error: 'record not found',
        });
      }

      // create repayment for loan
      const text = `INSERT INTO
      repayments(id, amount, loanId, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5)
      returning *`;

      const values = [
        uuidv4(),
        req.body.amount,
        loanId.trim(),
        new Date(),
        new Date(),
      ];

      db.query(text, values)
        .then(() => {
          const data = resp.rows[0];

          return res.status(201).json({
            status: 201,
            data: {
              loanId: data.loanId,
              createdOn: data.created_at,
              amount: loan.amount,
              monthlyInstallment: loan.paymentinstallment,
              paidAmount: data.amount,
              balance: loan.balance,
            },
          });
        })
        .catch((err) => {
          logger.error({ message: err.message });
          return res.status(400).json({
            status: 400,
            error: 'Failed to post loan repayment.',
          });
        });
    })
    .catch((err) => {
      logger.error({ message: err.message });
      return res.status(400).json({
        status: 400,
        error: 'Failed to find loan with provided id.',
      });
    });
};
