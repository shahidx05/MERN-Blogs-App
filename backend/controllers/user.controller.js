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