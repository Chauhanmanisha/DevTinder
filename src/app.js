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

