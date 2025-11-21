
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["ignored" , "rejected" , "accepeted", "interested"],
            message: `{values} is incorre status type`
        },
    }
}, { timestamps: true, } );

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    //Check if the fromUserId is same as the toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't send connection to yourself!");
    } 
    next();
});

const connectionRequestModel = mongoose.model("connectionRequestModel", connectionRequestSchema);
module.exports = connectionRequestModel;