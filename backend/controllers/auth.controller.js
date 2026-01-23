const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const token = jwt.sign({email: req.body.email}, "123@qwerty", {expiresIn: "3h"})
        const user = await User.create(req.body)
        res.send({user, token})
    } catch (error) {
        console.log("error", error)
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username:req.body.username})
        if(!user){
            return res.send("Invalid Crediantils")
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        
        if(!isMatch){
            return res.send("Invalid Crediantils")
        }
        const token = jwt.sign({email: user.email}, "123@qwerty", {expiresIn: "3h"})
        return res.send({user, token})
    } catch (error) {
        console.log("error", error)
    }
}

exports.me = async (req, res) =>{
    
}