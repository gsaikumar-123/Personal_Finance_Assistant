const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['salary','business','investments','food','rent','transport','entertainment','utilities','healthcare','education','other'],
        default: 'other'
    },
    date : {
        type: Date,
        required: true,
        default: Date.now
    },
    description : String,
    paymentMethod : {
        type: String,
        enum: ['cash','creditcard','debitcard','banktransfer','upi','other'],
        default: 'other'
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;