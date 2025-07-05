const express = require("express");
const {userAuth} = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.send("Error : " + err);
    }
});

module.exports = profileRouter;