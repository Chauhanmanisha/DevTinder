const express = require("express");
const requestsRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


requestsRouter.post("/sendConnectionRequest", userAuth , async(req, res) => {
    const user = req.user;
    //Sending a connection Request
    console.log("Sending a connection Request");

    res.send(user.firstName + "Connection Request Send");
});


module.exports = requestsRouter;

