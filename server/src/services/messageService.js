const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

/**
 * Persist a new message and bump the parent conversation's preview fields.
 * Shared by the REST fallback route and the Socket.IO handler so both
 * paths save messages the same way.
 */
async function createMessage({ conversationId, senderId, text }) {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    const err = new Error('Message text cannot be empty');
    err.status = 400;
    throw err;
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!conversation) {
    const err = new Error('Conversation not found');
    err.status = 404;
    throw err;
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text: trimmed,
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  return { message, conversation };
}

module.exports = { createMessage };
