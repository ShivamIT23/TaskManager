const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password, role = "admin" } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed, role });
  const createdUser = await user.save();
  const token = jwt.sign(
    { userId: createdUser._id, role: createdUser.role },
    process.env.JWT_SECRET
  );
  res.status(201).json({ message: "User registered", token });
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token });
});

router.get("/users", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.userId;

    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "username _id"
    );
    res.json(users);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
