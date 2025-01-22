const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');  // Assuming you have a User model
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('YOUR_MONGO_URI', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB", err));

// API Route (Adjust for Serverless)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();  // Assuming you're fetching users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Vercel Serverless Function Export (Important for Vercel)
module.exports = app;
