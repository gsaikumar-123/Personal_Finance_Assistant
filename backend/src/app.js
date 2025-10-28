const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/database');

const app = express();

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const transactionRouter = require('./routes/transactions');
const receiptRouter = require('./routes/receipt');

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

app.use('/api', authRouter);
app.use('/api', profileRouter);
app.use('/api', transactionRouter);
app.use('/api', receiptRouter);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

connectDb()
  .then(() => {
    const PORT = process.env.PORT || 1234;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
