const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const postController = require('../controllers/post.controller')

router.get('/', postController.getAllPosts)
router.get('/userP', postController.getAllPosts)
router.get('/:id', postController.getPost)
router.post('/',authMiddleware, postController.create)
router.put('/:id',authMiddleware, postController.edit)
router.delete('/:id',authMiddleware, postController.delete)

module.exports = router