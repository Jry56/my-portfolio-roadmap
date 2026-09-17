const User = require('../models/User');
const generateToken = require('../utils/generateToken');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

module.exports = { register, login, me };
