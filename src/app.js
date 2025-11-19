const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup" , async (req, res) => { 
   
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
        console.log("DBPassword=",user.password);
        res.send("User added Successfuly");
    }catch(err){
        res.status(400).send("  ERRO:" + err.message);
    }
});

app.post("/login", async(req , res) => {
    try{
        const {emailId , password} = req.body;
        
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("EmailId is not presetn in DB!");
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //Create a JWT token
            const token = await jwt.sign({_id: user._id } , "DEV@Tinder$790");
            console.log(token);

            //Add  the token to cookie  and send the respones bake to the user
            
            res.cookie("token", token);

            res.send("Login Successfully!");
        }
        else{
            throw new Error("Password is not correct!");
        }
    }catch(err){
        res.status(400).send("  ERROR:" + err.message);
    }
    
});

app.get("/profile", async(req, res) => {
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            throw new Error("Invalid Token");
        }

        // validate my token 

        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        
        const{ _id} = decodedMessage;
        console.log("Logged In user is: " + _id);

        const user = await User.findById(_id);
        
        if(!user){
            throw new Error("User does not exist!");
        }

        res.send(user);
   }catch(err){
    res.status(400).send("  ERROR:" + err.message);
   }

});

// Get user by emailId
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const users = await User.findOne({emailId:userEmail});
        res.send(users);
        // if(users.length === 0){
        //     res.status(404).send("user not find");
        // }else{
        //     res.send(users);
        // }
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

//Update data of the user 
app.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["about","gender","age",];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        
        const user = await User.findByIdAndUpdate({ _id: userId}, data , {runValidators: true});
        res.send("User Update Successfuly!");
    
    }catch(err){
        res.status(400).send("something went wrong");
    }
});

app.get("/feed", async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
       res.status(400).send("something went wrong"); 
    }
});

connectDB()
    .then(() => {
        console.log("Database Connection is established!");

        app.listen(7777 , () => {
          console.log("server is successfully listening the on the port 7777!");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!");
    });

