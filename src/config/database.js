const mongoose = require("mongoose");

const connectDB = async () => {
     await mongoose.connect(
        "mongodb+srv://mani265:yfQWu2bNoRcJdPNC@cluster0.mptncxc.mongodb.net/devTinder?appName=Cluster0"
    );
};

module.exports = connectDB;