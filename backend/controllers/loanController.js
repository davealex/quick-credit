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
