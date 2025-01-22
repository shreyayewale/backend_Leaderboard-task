const User = require("../models/User");
const History = require("../models/History");

// Fetch all users
exports.getUsers = async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
};

// Add a new user
exports.addUser = async (req, res) => {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
};

// Claim points
exports.claimPoints = async (req, res) => {
    const { userId } = req.params;
    const points = Math.floor(Math.random() * 10) + 1;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points;
    await user.save();

    const history = new History({ userId, points });
    await history.save();

    res.json({ user, points });
};
