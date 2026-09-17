const Message = require('../models/Message');
const { createMessage } = require('../services/messageService');

// POST /api/messages - REST fallback for sending a message (primary path is the socket "message:send" event)
async function sendMessage(req, res, next) {
  try {
    const { conversationId, text } = req.body;
    const { message } = await createMessage({
      conversationId,
      senderId: req.user._id,
      text,
    });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/messages/:id/read
async function markRead(req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.status = 'read';
    message.readAt = new Date();
    await message.save();
    res.json({ message });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, markRead };
