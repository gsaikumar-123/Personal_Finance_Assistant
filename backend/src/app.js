const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDb = require('./config/database');
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use("/" , authRouter);
app.use("/" , profileRouter);

connectDb()
  .then(() => {
    console.log("Database Connected");

    app.listen(process.env.PORT || 1234, () => {
      console.log("Server started on port 1234...");
    });
  })
  .catch((err) => {
    console.log("Database Connection Error:", err.message);
  });