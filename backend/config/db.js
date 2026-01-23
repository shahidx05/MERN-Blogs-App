require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ MongoDB connected");
        
    } catch (error) {
        console.log("error", error);
        
    }
}

module.exports = connectDB