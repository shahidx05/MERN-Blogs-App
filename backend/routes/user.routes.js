const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const upload = require("../middleware/upload.middleware");
const userController = require('../controllers/user.controller')

router.get('/:username', userController.getUserProfile)
router.put('/profile', authMiddleware, upload.single("profile_img"), userController.updateProfile)

module.exports = router