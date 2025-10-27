const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDb = require('./config/database');
const app = express();

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const transactionRouter = require('./routes/transactions');
const receiptRouter = require('./routes/receipt');

app.use(express.json());
app.use(cookieParser());

app.use("/api" , authRouter);
app.use("/api" , profileRouter);
app.use("/api" , transactionRouter);
app.use("/api", receiptRouter);

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 1234, () => {
    });
  })
  .catch((err) => {
  });