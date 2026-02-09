const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/:postId', authMiddleware, commentController.create)
router.get('/:postId', commentController.getComments)
router.delete('/:id', authMiddleware, commentController.delete)

module.exports = router