const mongoose = require('mongoose');
const vallidator = require('validator');

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
    email: {
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

const User = mongoose.model("User", userSchema);
module.exports = User;
