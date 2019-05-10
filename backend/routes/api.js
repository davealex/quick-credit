const express = require('express');

const router = express.Router();

const Users = require('../controllers/userController');

const apiVersion = '/api/v1';

router.get(`${apiVersion}/users`, Users.getAllUsers);
// user endpoints
router.post(`${apiVersion}/auth/signup`, Users.signUp);

module.exports = router;
