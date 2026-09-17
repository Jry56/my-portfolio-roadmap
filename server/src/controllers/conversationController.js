const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/conversations - all conversations for the current user, most recent first
async function listConversations(req, res, next) {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name email avatarSeed isOnline lastSeen about')
      .populate({ path: 'lastMessage', select: 'text sender status createdAt' })
      .sort({ lastMessageAt: -1 });

    res.json({ conversations });
  } catch (err) {
    next(err);
  }
}

// POST /api/conversations  { userId } - find or create a 1:1 conversation
async function startConversation(req, res, next) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (userId === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot start a conversation with yourself' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user._id, userId] });
    }

    conversation = await conversation.populate('participants', 'name email avatarSeed isOnline lastSeen about');
    res.status(201).json({ conversation });
  } catch (err) {
    next(err);
  }
}

// GET /api/conversations/:id/messages?before=<ISO date>&limit=30
async function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const { before, limit = 30 } = req.query;

    const conversation = await Conversation.findOne({ _id: id, participants: req.user._id });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const filter = { conversation: id };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 30, 100));

    res.json({ messages: messages.reverse() });
  } catch (err) {
    next(err);
  }
}

module.exports = { listConversations, startConversation, getMessages };
