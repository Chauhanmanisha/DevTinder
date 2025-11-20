const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const requireRouter = require("./routes/requests");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

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

