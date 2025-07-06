const express = require("express");
const {userAuth} = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
        const user = req.user;
        res.json({ message: "Profile fetched", data: user });
    }
    catch(err){
        console.error("Profile error:", err);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

module.exports = profileRouter;