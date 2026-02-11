const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const postController = require('../controllers/post.controller')
const upload = require("../middleware/upload.middleware");

router.get('/', postController.getPosts)
router.get('/my',authMiddleware, postController.getMyPosts)
router.get('/user/:id', postController.getUserPosts)
router.get('/:id', postController.getPost)
router.post('/',authMiddleware,  upload.single("img"), postController.create)
router.put('/:id', authMiddleware, upload.single("img"), postController.edit)
router.patch('/like/:id', authMiddleware, postController.like)
router.delete('/:id',authMiddleware, postController.delete)

module.exports = router