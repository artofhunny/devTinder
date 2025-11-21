const express = require("express");
// const { authMiddleware, userAuthMiddleware } = require("./middleware/auth");
const connectDb = require("./config/database");
const User = require("./model/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cros = require("cors");
require("dotenv").config();

const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cros({
    // origin: "http://localhost:5173",
    // origin: true,
    origin: ["http://192.168.1.3:5173", "http://localhost:5173"],
    credentials: true,
}));

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter = require("./router/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



// find user by email id
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;    

    try{
        const users = await User.find({emailId: userEmail});
        // if(users.length === 0) res.status(400).send("User not found");
        res.send(users);
    }
    catch(err){
        res.send("Somethig went wrong");
    }
});

connectDb()
    .then(() => {
        console.log("Database connection is established");
        app.listen(3000, () => console.log("Server is successfully listen on the port 3000"));
    })
    .catch((err) => {
        console.log("Error in establishing connection with database");
    });


