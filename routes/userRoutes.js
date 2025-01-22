const express = require("express");
const { getUsers, addUser, claimPoints } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.post("/:userId/claim", claimPoints);

module.exports = router;
