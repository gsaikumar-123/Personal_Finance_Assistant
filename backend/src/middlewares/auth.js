const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req,res,next)=>{
    try {
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            return res.status(401).json({ message: "Please Login" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not set in environment');
        }
        const decoddedMessage = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decoddedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User Not found");
        }
        req.user = user;
        next();
    } 
    catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
    }

}

module.exports = {
    userAuth
};