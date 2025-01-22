const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON data

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/leaderboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema);

// Claim History Schema
const ClaimHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  claimedAt: { type: Date, default: Date.now },
});

const ClaimHistory = mongoose.model('ClaimHistory', ClaimHistorySchema);

// Routes

// 1. Add a new user
app.post('/api/users/add', async (req, res) => {
  const { name } = req.body;

  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = new User({ name });
      await user.save();
    }
    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user', error });
  }
});

// 2. Get all users (leaderboard)
app.get('/api/users', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ points: -1 }); // Sort by points in descending order
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// 3. Claim random points for a user
app.post('/api/users/:userId/claim', async (req, res) => {
  const { userId } = req.params;

  try {
    const points = Math.floor(Math.random() * 10) + 1; // Random points between 1 and 10
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's points
    user.points += points;
    await user.save();

    // Add entry to ClaimHistory
    const history = new ClaimHistory({ userId: user._id, points });
    await history.save();

    res.json({ message: 'Points claimed', user, history });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ message: 'Error claiming points', error });
  }
});

// 4. Get claim history
app.get('/api/history', async (req, res) => {
  try {
    const history = await ClaimHistory.find().populate('userId', 'name');
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Error fetching history', error });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
