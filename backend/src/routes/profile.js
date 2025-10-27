const express = require("express");
const {userAuth} = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
                // Do not expose password or internal fields
                const user = req.user;
                const safeUser = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
                res.json({ message: "Profile fetched", data: safeUser });
    }
    catch(err){
        console.error("Profile error:", err);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

module.exports = profileRouter;