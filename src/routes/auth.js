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

        const savedUser = await user.save();
        const token = await user.getJWT();
            res.cookie("token", token , {
                expires : new Date(Date.now() + 8 * 3600000)
            });
           
        // console.log("DBPassword=",user.password);
        res.json({ message: "User added Successfuly!" , data: savedUser});
    }catch(err){
        res.status(400).send("  ERRO: " + err.message);
    }
});

authRouter.post("/login", async(req , res) => {
    try{
        const {emailId , password} = req.body;
        
        const user = await User.findOne({emailId : emailId});
        if(!user){
            return res.status(401).send("Please Login!");
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

            res.send(user);
        }
        else{
            throw new Error("Invalid credentials");
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