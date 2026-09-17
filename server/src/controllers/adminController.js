const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/admin/stats
async function getStats(req, res, next) {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalUsers, onlineUsers, totalConversations, totalMessages, messagesToday, newUsersToday] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isOnline: true }),
        Conversation.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ createdAt: { $gte: since24h } }),
        User.countDocuments({ createdAt: { $gte: since24h } }),
      ]);

    res.json({
      totalUsers,
      onlineUsers,
      totalConversations,
      totalMessages,
      messagesToday,
      newUsersToday,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?search=&page=&limit=
async function listAllUsers(req, res, next) {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Number(limit) || 20, 100);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      User.countDocuments(filter),
    ]);

    res.json({
      users: users.map((u) => u.toPublicJSON()),
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/status  { status: 'active' | 'suspended' }
async function setUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'status must be "active" or "suspended"' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be suspended here' });
    }

    user.status = status;
    await user.save();
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted here' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/conversations?page=&limit=
async function listAllConversations(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Number(limit) || 20, 100);

    const [conversations, total] = await Promise.all([
      Conversation.find()
        .populate('participants', 'name email avatarSeed')
        .populate('lastMessage', 'text createdAt')
        .sort({ lastMessageAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Conversation.countDocuments(),
    ]);

    res.json({ conversations, total, page: pageNum, pages: Math.ceil(total / pageSize) || 1 });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, listAllUsers, setUserStatus, deleteUser, listAllConversations };
