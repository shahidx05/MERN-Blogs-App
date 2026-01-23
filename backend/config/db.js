require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb+srv://shahidx05:2005%40Shahid@cluster0.rrnfc1t.mongodb.net/min_project')
        console.log("✅ MongoDB connected");
        
    } catch (error) {
        console.log("error", error);
        
    }
}

module.exports = connectDB