const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please login!");
        }

        const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedData;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User doesn't exist");
        }

        req.user = user;
        next();
    }
    catch(err){
        res.send("Error in auth: " + err.message);
    }
    
}

module.exports = {
    userAuth,
}