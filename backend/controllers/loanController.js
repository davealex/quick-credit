const loans = require('../seeds/loans');
const compute = require('../util/loanComputedValues');
const {
  validateRequiredFields,
} = require('../util/helpers');

exports.store = (req, res) => {
  const error = [];
  const expectedValues = ['firstName', 'lastName', 'email', 'tenor', 'amount'];

  validateRequiredFields(expectedValues, req.body, error);

  if (error.length > 0) {
    res.status(422).json({
      status: 422,
      error,
    });
    return;
  }

  const {
    firstName, lastName, email, tenor, amount,
  } = req.body;

  res.status(201).json({
    status: 201,
    data: {
      loanId: 2,
      firstName,
      lastName,
      email,
      tenor,
      amount,
      paymentInstallment: compute.installment(amount, 5, tenor),
      status: 'pending',
      balance: compute.balance(amount, 5),
      interest: compute.interest(5, amount),
    },
  });
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

  return res.status(200).json({
    status: 200,
    data: {
      loanId: Number(loanId),
      createdOn: new Date(),
      monthlyInstallment: 333.22,
      amount: 499.99,
    },
  });
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
