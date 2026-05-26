const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.log('About to call User.create...');
    const user = await User.create({ name, email, password });
    console.log('User.create succeeded:', user._id);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('=== REGISTER ERROR STACK ===');
    console.error(error.stack);
    console.error('============================');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is deactivated' });
    }
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('=== LOGIN ERROR STACK ===');
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
