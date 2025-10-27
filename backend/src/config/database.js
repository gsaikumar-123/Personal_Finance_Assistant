const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{});
    }
    catch (error) {
        process.exit(1);
    }
}

module.exports = connectDb;