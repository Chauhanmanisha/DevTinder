const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next(); 
    }
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!!!");
        }

        // validate my token 
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        const{ _id} = decodedMessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();
   }catch(err){
    return res.status(401).json({ message: "Invalid or expired token" });
   }
};

module.exports = { userAuth };
