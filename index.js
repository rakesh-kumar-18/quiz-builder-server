const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routers/auth.routes');
const quizeRouter = require('./routers/quize.routes');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/quize', quizeRouter);

app.get('/api/v1/health', (req, res) => {
  res.send('Api is working');
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Database connected');
  } catch (error) {
    console.log('Database connection error');
  }
  console.log('server is up :)');
});
