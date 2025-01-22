const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  totalPoints: { type: Number, default: 0 },
});

const ClaimHistorySchema = new mongoose.Schema({
  userId: String,
  points: Number,
  claimedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const ClaimHistory = mongoose.model("ClaimHistory", ClaimHistorySchema);

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/leaderboard", { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name } = req.body;
  const newUser = new User({ name });
  await newUser.save();
  res.json(newUser);
});

app.post("/users/:userId/claim", async (req, res) => {
  const userId = req.params.userId;
  const points = Math.floor(Math.random() * 10) + 1;

  const user = await User.findById(userId);
  if (user) {
    user.totalPoints += points;
    await user.save();

    // Save claim history
    const history = new ClaimHistory({ userId, points });
    await history.save();

    res.json({ message: "Points claimed!", user, points });
  } else {
    res.status(404).json({ message: "User not found!" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
