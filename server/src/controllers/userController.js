const User = require('../models/User');

// GET /api/users?search=term - list people the current user can start a chat with
async function listUsers(req, res, next) {
  try {
    const { search = '' } = req.query;
    const filter = {
      _id: { $ne: req.user._id },
      status: 'active',
      role: 'user', // exclude admin accounts from the contact list
    };

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const users = await User.find(filter).sort({ name: 1 }).limit(50);
    res.json({ users: users.map((u) => u.toPublicJSON()) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/me - update own profile
async function updateProfile(req, res, next) {
  try {
    const { name, about } = req.body;
    if (name) req.user.name = name;
    if (about !== undefined) req.user.about = about;
    await req.user.save();
    res.json({ user: req.user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, updateProfile };