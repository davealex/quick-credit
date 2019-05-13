const express = require('express');

const routerV1 = express.Router();

const User = require('../../../controllers/userController');
const Loan = require('../../../controllers/loanController');
const isAdmin = require('../../../middlewares/admin');

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
 *     responses:
 *       200:
 *         description: signup
 */

routerV1.patch('/users/:email/verify', isAdmin, User.verify);

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
routerV1.post('/loans', Loan.store);

module.exports = routerV1;
