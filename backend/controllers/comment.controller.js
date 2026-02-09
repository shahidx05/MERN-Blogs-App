const mongoose = require('mongoose')
const Comment = require('../models/Comment')

exports.create = async (req, res) => {
    try {
        const { postId } = req.params
        const { content } = req.body
        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content is required" })
        }

        let comment = await Comment.create({
            content,
            author: userId,
            post: postId
        })

        comment = await comment.populate("author", "name username profile_img")

        res.status(201).json({
            success: true,
            message: "Comment Created successfully",
            comment
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "username profile_img")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid comment id" });
        }
        const userId = req.user.id
        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized' })
        }

        await comment.deleteOne()

        res.status(200).json({ message: "Comment deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
