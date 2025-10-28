const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/database');

const app = express();
app.set('trust proxy', 1);

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const transactionRouter = require('./routes/transactions');
const receiptRouter = require('./routes/receipt');

app.use(express.json());
app.use(cookieParser());

const allowedFromEnv = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://personal-finance-assistant.vercel.app',
  ...allowedFromEnv,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
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
