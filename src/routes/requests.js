const express = require("express");
const requestsRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connections } = require("mongoose");



requestsRouter.post("/request/send/:status/:toUserId", userAuth , async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status});

        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message : "User iS not found!"})
        }

        //IF there is existing connectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId , toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request is Already Exists!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message:  req.user.firstName + " is " + status + " in " + toUser.firstName ,
            data,
        });

    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
    
});

requestsRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    const loggedInUser = req.user;
    const {status, requestId} = req.params;

    const allowedStatus = ["rejected" , "accepted"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Invalid status type: " + status});
    }
    
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
    });

    if(!connectionRequest){
        return res.status(400).send({message: "Connection Request not found!"});
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({message: "Connection Request " + status, data});
});

module.exports = requestsRouter;

