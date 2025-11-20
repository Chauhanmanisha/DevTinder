const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        maxLength:50,
        required:true,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid:" + value);
            }
        },
    },
    password:{
        type: String,
        required:true,
        unique:true,
    },
    age:{
        type: String,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male" , "female" , "other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    about:{
        type: String,
        default:"this is a default about of the users",
    },
    skills: {
        type : [String],
    },

 },{timestamps:true});


 userSchema.methods.getJWT = async function () { // helper mehtod -> that hepls create a token for every users
    const user = this;
    const token = await jwt.sign({_id: user._id } , "DEV@Tinder$790", {expiresIn:"1d"});
    return token;
 }

 userSchema.methods.validatePassword = async function (passwordInputByUser) { 
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
 }

 const User = mongoose.model("User", userSchema ); // create user model (user name , userSchema )

 module.exports = User;