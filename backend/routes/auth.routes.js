const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/login', authController.me)

module.exports = router