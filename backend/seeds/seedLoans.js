const uuidv4 = require('uuid/v4');
const db = require('./../database/connect');
const logger = require('../config/winston');

const loans = [
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2014-08-28T11:03:44',
    status: 'approved',
    repaid: true,
    tenor: 7,
    amount: 1212.69,
    paymentInstallment: '1,021.35',
    balance: '1,718.99',
    interest: '3,487.26',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2014-01-30T10:05:35',
    status: 'pending',
    repaid: true,
    tenor: 12,
    amount: 1787.40,
    paymentInstallment: '3,192.99',
    balance: '2,713.10',
    interest: '2,456.92',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2018-05-23T06:44:12',
    status: 'approved',
    repaid: false,
    tenor: 1,
    amount: 3601.78,
    paymentInstallment: '1,029.67',
    balance: '2,066.44',
    interest: '1,452.60',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2017-07-14T09:10:53',
    status: 'rejected',
    repaid: true,
    tenor: 12,
    amount: 1409.59,
    paymentInstallment: '2,693.73',
    balance: '3,874.02',
    interest: '2,643.80',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2016-02-20T01:41:03',
    status: 'rejected',
    repaid: true,
    tenor: 2,
    amount: 1202.17,
    paymentInstallment: '2,638.64',
    balance: '1,251.44',
    interest: '3,002.22',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2015-02-02T02:09:10',
    status: 'rejected',
    repaid: true,
    tenor: 3,
    amount: 2742.77,
    paymentInstallment: '2,081.11',
    balance: '3,390.29',
    interest: '2,079.94',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2018-05-22T04:13:31',
    status: 'approved',
    repaid: true,
    tenor: 1,
    amount: 1448.99,
    paymentInstallment: '3,483.76',
    balance: '1,053.37',
    interest: '3,537.15',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2014-08-28T11:03:44',
    status: 'approved',
    repaid: true,
    tenor: 7,
    amount: 1212.69,
    paymentInstallment: '1,021.35',
    balance: '1,718.99',
    interest: '3,487.26',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2014-01-30T10:05:35',
    status: 'pending',
    repaid: true,
    tenor: 12,
    amount: 1787.40,
    paymentInstallment: '3,192.99',
    balance: '2,713.10',
    interest: '2,456.92',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2018-05-23T06:44:12',
    status: 'approved',
    repaid: false,
    tenor: 1,
    amount: 3601.78,
    paymentInstallment: '1,029.67',
    balance: '2,066.44',
    interest: '1,452.60',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2017-07-14T09:10:53',
    status: 'rejected',
    repaid: true,
    tenor: 12,
    amount: 1409.59,
    paymentInstallment: '2,693.73',
    balance: '3,874.02',
    interest: '2,643.80',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2016-02-20T01:41:03',
    status: 'rejected',
    repaid: true,
    tenor: 2,
    amount: 1202.17,
    paymentInstallment: '2,638.64',
    balance: '1,251.44',
    interest: '3,002.22',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2015-02-02T02:09:10',
    status: 'rejected',
    repaid: true,
    tenor: 3,
    amount: 2742.77,
    paymentInstallment: '2,081.11',
    balance: '3,390.29',
    interest: '2,079.94',
  },
  {
    id: uuidv4(),
    user: 'imogenesykes@ezentia.com',
    createdOn: '2018-05-22T04:13:31',
    status: 'approved',
    repaid: true,
    tenor: 1,
    amount: 1448.99,
    paymentInstallment: '3,483.76',
    balance: '1,053.37',
    interest: '3,537.15',
  },
];


exports.seedLoans = () => {
  loans.forEach((loan) => {
    const text = `INSERT INTO
      loans(id, email, repaid, tenor, amount, paymentinstallment, status, balance, interest, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *`;

    const values = [
      uuidv4(),
      'james@gmail.com',
      loan.repaid,
      loan.tenor,
      loan.amount,
      loan.paymentInstallment,
      loan.status,
      loan.balance,
      loan.interest,
      new Date(),
      new Date(),
    ];

    db.query(text, values)
      .then((resp) => {
        const [data] = resp.rows;
      })
      .catch((err) => {
        logger.error({ message: err.message });
      });
  });
};
