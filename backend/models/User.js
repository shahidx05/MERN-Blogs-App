const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        minlength: 4,
        maxlength: 20,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    profile_img: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)