const express = require('express');

const router = express.Router();

const Users = require('../controllers/userController');
const Index = require('../controllers/indexController');

const apiVersion = '/api/v1';

// API home endpoint
router.get('/', Index.getIndex);

// user signup endpoints
/**
 * @swagger
 *
 * /api/v1/signup:
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
router.post(`${apiVersion}/auth/signup`, Users.signUp);

module.exports = router;
