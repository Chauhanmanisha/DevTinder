const express = require("express");
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup" , async (req, res) => { 
   
    try{
        //Validation of data
        validateSignUpData(req);
        
        const {firstName,lastName,emailId,password} = req.body;
        
        // encrypt the password 
        const passwordHash = await bcrypt.hash(password , 10);

        //Creating a new Instance of the user Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });

        await user.save();
        // console.log("DBPassword=",user.password);
        res.send("User added Successfuly");
    }catch(err){
        res.status(400).send("  ERRO: " + err.message);
    }
});

authRouter.post("/login", async(req , res) => {
    try{
        const {emailId , password} = req.body;
        
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("EmailId is not presetn in DB!");
        }
        
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            //Create a JWT token
            const token = await user.getJWT();
          //  console.log(token);

            //Add  the token to cookie  and send the respones bake to the user
            
            res.cookie("token", token , {
                expires : new Date(Date.now() + 8 * 3600000)
            });

            res.send("Login Successfully!");
        }
        else{
            throw new Error("Password is not correct!");
        }
    }catch(err){
        res.status(400).send("  ERROR:" + err.message);
    }
    
});

authRouter.post("/logout", async(req, res) => {
    res.cookie("token" , null , {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
});


module.exports = authRouter; 