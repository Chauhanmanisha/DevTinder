const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        minLength:4,
        maxLength:50,
        required:true,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
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

 const User = mongoose.model("User", userSchema ); // create user model (user name , userSchema )

 module.exports = User;