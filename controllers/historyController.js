const History = require("../models/History");

exports.getHistory = async (req, res) => {
    const history = await History.find().populate("userId", "name");
    res.json(history);
};
