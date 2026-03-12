const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const upload = require("../middleware/upload.middleware");
const userController = require('../controllers/user.controller')

router.get('/bookmarks/:username', userController.getUserBookmarks)
router.get('/:username', userController.getUserProfile)
router.get('/:username/followers', userController.getUserFollowers)
router.get('/:username/following', userController.getUserFollowing)
router.patch('/bookmarks/:id', authMiddleware, userController.bookmark)
router.patch('/follow/:id', authMiddleware, userController.Follow)
router.put('/profile', authMiddleware, upload.single("profile_img"), userController.updateProfile)

module.exports = router