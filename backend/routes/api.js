const express = require('express');

const router = express.Router();

const Users = require('../controllers/userController');
const Index = require('../controllers/indexController');

const apiVersion = '/api/v1';

router.get('/', Index.getIndex);
// user endpoints
router.post(`${apiVersion}/auth/signup`, Users.signUp);

module.exports = router;
