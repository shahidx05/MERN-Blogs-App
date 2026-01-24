const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, username, email, password, profile_img } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        const user = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        newUser = await User.create({
            name,
            username,
            email,
            password: hash,
            profile_img
        })

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        )

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                profile_img: newUser.profile_img,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profile_img: user.profile_img,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.me = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select("-password -__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user, });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}