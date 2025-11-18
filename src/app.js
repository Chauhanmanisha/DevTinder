const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup" , async (req, res) => {
   
    try{
        //Validation of data
        validateSignUpData(req);
        
        const {firstName,lastName,emailId,password} = req.body;
        
        // encrypt the password 
        const passwordHash = await bcrypt.hash(password , 10);
        console.log(passwordHash);

        //Creating a new Instance of the user Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });

        await user.save();
        res.send("User added Successfuly");
    }catch(err){
        res.status(400).send("  ERRO:" + err.message);
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

