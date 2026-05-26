const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const logActivity = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    console.error("Register error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status === "inactive") {
      return res.status(403).json({ message: "Account is deactivated" });
    }
    const token = generateToken(user._id, user.role);
    await logActivity(user._id, "LOGIN", user.name + " logged in");
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    console.error("Login error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
