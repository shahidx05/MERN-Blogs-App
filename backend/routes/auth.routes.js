const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const authController = require('../controllers/auth.controller')
const { loginLimiter, registerLimiter} = require("../middleware/rateLimiter");

router.post('/register', registerLimiter, authController.register)
router.post('/login', loginLimiter, authController.login)
router.get('/me',authMiddleware, authController.me)

module.exports = router