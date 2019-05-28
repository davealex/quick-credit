const express = require('express');

const routerV1 = express.Router();

const User = require('../../../controllers/userController');
const Loan = require('../../../controllers/loanController');
const isAdmin = require('../../../middlewares/admin');
const isAuth = require('../../../middlewares/auth');
const canTakeLoan = require('../../../middlewares/canTakeLoan');

// user signup endpoint
/**
 * @swagger
 *
 * /api/v1/auth/signup:
 *   post:
 *     description: Signup to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User First Name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User Last Name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: confirmPassword
 *         description: User's Confirmed password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User Email Address.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: homeAddress
 *         description: User's Home Address.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: workAddress
 *         description: User's Work Address.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: signup
 */
routerV1.post('/auth/signup', User.signUp);

// user sign in
/**
 * @swagger
 *
 * /api/v1/auth/signin:
 *   post:
 *     description: Signup to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User Email Address.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: sign in
 */
routerV1.post('/auth/signin', User.signIn);

// verify user
/**
 * @swagger
 *
 * /api/v1/users/:email/verify:
 *   patch:
 *     description: User Verification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email.
 *         in: url
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: verify user
 */

routerV1.patch('/users/:email/verify', [isAuth, isAdmin], User.verifyUser);

// user loan application
/**
 * @swagger
 *
 * /api/v1/loans:
 *   post:
 *     description: Apply for loan
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User First Name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User Last Name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User Email Address.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: tenor
 *         description: loan repayment duration.
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: amount
 *         description: loan value.
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       201:
 *         description: loan application
 */
routerV1.post('/loans', [isAuth, canTakeLoan], Loan.applyForLoan);

// view specific loan
/**
 * @swagger
 *
 * /api/v1/loans/:loanId:
 *   get:
 *     description: view specific loan
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: loanId
 *         description: loan Id.
 *         in: url
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: view specific loan
 */
routerV1.get('/loans/:loanId', [isAuth, isAdmin], Loan.showLoan);
// routerV1.get('/loans/:loanId', [isAuth], Loan.showLoan);

// view all loan applications
/**
 * @swagger
 *
 * /api/v1/loans:
 *   get:
 *     description: view all loans
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: view specific loan
 */
routerV1.get('/loans', [isAuth, isAdmin], Loan.index);

// view loan repayment history
/**
 * @swagger
 *
 * /api/v1/loans/:loanId/repayments:
 *   get:
 *     description: view loan repayment history
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: loanId
 *         description: loan Id.
 *         in: url
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: view loan repayment history
 */
routerV1.get('/loans/:loanId/repayments', [isAuth, isAdmin], Loan.repayments);

// view user repaid loans
/**
 * @swagger
 *
 * /api/v1/loans?status=approved&repaid=true:
 *   get:
 *     description: view user repaid loans
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: status
 *         description: loan application status.
 *         in: url
 *         required: true
 *         type: string
 *       - name: repaid
 *         description: loan repayment status.
 *         in: url
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: view user repaid loans
 */
// routerV1.get('/loans?status=approved&repaid=true', Loan.index);

// view user current loans
/**
 * @swagger
 *
 * /api/v1/loans?status=approved&repaid=false:
 *   get:
 *     description: view user current loans
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: status
 *         description: loan application status
 *         in: url
 *         required: true
 *         type: string
 *       - name: repaid
 *         description: loan repayment status
 *         in: url
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: view user repaid loans
 */
// routerV1.get('/loans?status=approved&repaid=false', Loan.index);

// approve/reject a loan application
/**
 * @swagger
 *
 * /api/v1/loans/<:loanId>:
 *   patch:
 *     description: approve/reject a loan application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: loanId
 *         description: loan Id.
 *         in: url
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: view user repaid loans
 */
routerV1.patch('/loans/:loanId', [isAuth, isAdmin], Loan.update);

// admin can post a loan repayment
/**
 * @swagger
 *
 * /api/v1/loans/<:loanId/repayment>:
 *   post:
 *     description: post a loan repayment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: loanId
 *         description: loan Id.
 *         in: url
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: loan repayment posted
 */
routerV1.post('/loans/:loanId/repayment', [isAuth, isAdmin], Loan.createRepayment);

module.exports = routerV1;
