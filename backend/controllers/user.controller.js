const User = require('../models/User')
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password -__v -email");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user, });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Invalid image" });
        }
        const result = await uploadToCloudinary(req.file.buffer, "profiles")

        const user = await User.findByIdAndUpdate(req.user.id,
            { profile_img: result.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}