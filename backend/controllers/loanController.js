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


  return res.status(200).json({
    status: 200,
    data: {
      id: Number(loanId),
      user: 'user@m.com',
      createdOn: new Date().getTime(),
      status: 'verified',
      repaid: true,
      tenor: 3,
      amount: 3000.00,
      paymentInstallment: 234.12,
      balance: 12000.00,
      interest: 6.0,
    },
  });
};
