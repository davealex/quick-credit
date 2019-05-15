const loans = require('../seeds/loans');
const compute = require('../util/loanComputedValues');

exports.store = (req, res) => {
  const errors = [];
  const expectedValue = ['firstName', 'lastName', 'email', 'tenor', 'amount'];

  expectedValue.forEach((value) => {
    if (!(value in req.body)) {
      errors.push({
        [value]: `The ${value} field is required`,
      });
    }
  });

  if (errors.length > 0) {
    res.status(422).json({
      status: 422,
      errors,
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
