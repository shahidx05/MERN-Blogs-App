const mongoose = require('mongoose')
const User = require('../models/User')
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.getUserProfile = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username }).select("-password -__v -email");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, username } = req.body;
        let updateData = {};

        if (name) updateData.name = name;
        if (username) updateData.username = username;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "profiles");
            updateData.profile_img = result.secure_url;
        }


        const user = await User.findByIdAndUpdate(req.user.id,
            updateData,
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.bookmark = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }

        const user = await User.findById(req.user.id)

        if (user.bookmarks.includes(id)) {
            user.bookmarks.pull(id)
        }
        else {
            user.bookmarks.push(id)
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: "Bookmark added successfully",
            bookmarks: user.bookmarks
        })

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getUserBookmarks = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
            .populate({
                path: "bookmarks",
                populate: {
                    path: "author",
                    select: "username profile_img"
                }
            })
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validBookmarks = user.bookmarks.filter(post => post !== null);
        res.status(200).json({ success: true, bookmarks: validBookmarks });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}