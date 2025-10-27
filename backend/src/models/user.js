const mongoose = require('mongoose');
const vallidator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 25
    },
    lastName :{
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!vallidator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password : {
        type : String,
        required : true,
        validator : function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    }
},
{
    timestamps: true
});

userSchema.index({firstName:1,lastName:1});

userSchema.methods.getJWT = async function (){
    const user = this;

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not set in environment');
    }
    const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET,{
        expiresIn : "7d",
    });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    passwordHash = user.password

    const isMatch = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isMatch;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
