const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route define kar rahe hain
router.post('/login', authController.login);
router.post('/register', authController.register);
module.exports = router;