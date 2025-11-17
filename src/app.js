const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup" , async (req, res) => {
    console.log(req.body);
    //Creating a new Instance of the user Model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added Successfuly");
    }catch(err){
        res.status(400).send("Error saving the user:" + err.message);
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

