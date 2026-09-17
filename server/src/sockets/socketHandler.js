const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const { createMessage } = require('../services/messageService');

// Tracks which socket ids belong to which user, so we can target rooms and
// know when a user has truly gone offline (they may have several tabs open).
const userSockets = new Map(); // userId -> Set<socketId>

function addSocket(userId, socketId) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
}

function removeSocket(userId, socketId) {
  const set = userSockets.get(userId);
  if (!set) return true;
  set.delete(socketId);
  const isLastSocket = set.size === 0;
  if (isLastSocket) userSockets.delete(userId);
  return isLastSocket;
}

async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.status === 'suspended') {
      return next(new Error('Not authorized'));
    }

    socket.userId = String(user._id);
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
}

function registerSocketHandlers(io) {
  io.use(authenticateSocket);

  io.on('connection', async (socket) => {
    const { userId } = socket;
    addSocket(userId, socket.id);
    socket.join(`user:${userId}`);

    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    socket.broadcast.emit('presence:update', { userId, isOnline: true });

    // Join a specific conversation "room" to receive its messages/typing events
    socket.on('conversation:join', (conversationId) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      if (conversationId) socket.leave(`conversation:${conversationId}`);
    });

    // Primary send path: client emits, server persists, then broadcasts to the room
    socket.on('message:send', async ({ conversationId, text }, ack) => {
      try {
        const { message, conversation } = await createMessage({
          conversationId,
          senderId: userId,
          text,
        });

        io.to(`conversation:${conversationId}`).emit('message:new', { message });

        // Notify participants who might not have the conversation open, so
        // their conversation list can update its preview/unread state.
        conversation.participants
          .map(String)
          .filter((id) => id !== userId)
          .forEach((id) => {
            io.to(`user:${id}`).emit('conversation:updated', {
              conversationId,
              lastMessage: message,
            });
          });

        if (typeof ack === 'function') ack({ ok: true, message });
      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    socket.on('typing:start', ({ conversationId }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('typing:update', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    socket.on('message:read', async ({ messageId, conversationId }) => {
      if (!messageId) return;
      await Message.findByIdAndUpdate(messageId, { status: 'read', readAt: new Date() });
      socket.to(`conversation:${conversationId}`).emit('message:read', { messageId });
    });

    socket.on('disconnect', async () => {
      const wasLastSocket = removeSocket(userId, socket.id);
      if (wasLastSocket) {
        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
        io.emit('presence:update', { userId, isOnline: false, lastSeen });
      }
    });
  });
}

module.exports = registerSocketHandlers;
