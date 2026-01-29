const Post = require('../models/Post')
const mongoose = require('mongoose')
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.getAllPosts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
        const sort = req.query.sort || "latest";

        const skip = (page - 1) * limit

        const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const posts = await Post.find()
            .populate("author", "name username profile_img")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPosts,
            totalPages: totalPages,
            posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getMyPosts = async (req, res) => {
    try {
        const {id} = req.user
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
        const sort = req.query.sort || "latest";

        const skip = (page - 1) * limit

        const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const posts = await Post.find({author: id})
            .populate("author", "name username profile_img")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)

        const totalPosts = await Post.countDocuments({ author: id });
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPosts,
            totalPages: totalPages,
            posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
        const sort = req.query.sort || "latest";

        const skip = (page - 1) * limit

        const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const posts = await Post.find({ author: id })
            .populate("author", "name username profile_img")
            .sort(sortOption)
            .skip(skip)
            .limit(limit)

        const totalPosts = await Post.countDocuments({ author: id });
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalPosts,
            totalPages: totalPages,
            posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        const post = await Post.findById(id)
            .populate("author", "name username profile_img");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.create = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id

        if (!title || !content) {
            return res.status(400).json({ message: "All fields are required" })
        }

        let img = "";

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "posts")
            img = result.secure_url;
        }

        const post = await Post.create({
            title,
            content,
            img,
            author: userId
        })

        res.status(201).json({
            success: true,
            message: "Post Created successfully",
            post
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.edit = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const userId = req.user.id

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized' })
        }

        if (req.body.title !== undefined) post.title = req.body.title;
        if (req.body.content !== undefined) post.content = req.body.content;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "posts")
            post.img = result.secure_url;
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post Updated successfully",
            post
        })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const userId = req.user.id
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized' })
        }

        await post.deleteOne()

        res.status(200).json({ message: "Post deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}