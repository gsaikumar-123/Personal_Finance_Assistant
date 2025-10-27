const express = require("express");
const authRouter = express.Router();
const User = require('../models/user');
const {validateSignUpdata} = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup",async (req,res)=>{
    try{
        validateSignUpdata(req);
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash
        });

        const newUser = await user.save();
        const token = await newUser.getJWT();

        res.cookie("token", token, {
          expires: new Date(Date.now() + 3600000),
        });
        
        const safeUser = {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          emailId: newUser.emailId,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };
        res.json({message : "User created",data : safeUser});
    }
    catch(err){
        res.send("Error creating account : " + err);
    }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    res.status(200).json({ message: "Login successful", data: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});


authRouter.get("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now()),
    });
    res.json({message: "Log Out Successfully"});
});




module.exports = authRouter;

