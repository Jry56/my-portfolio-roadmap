require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const registerSocketHandlers = require('./sockets/socketHandler');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const allowedOrigins = [process.env.CLIENT_ORIGIN, process.env.ADMIN_ORIGIN].filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic protection against brute-force login/register attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`[server] listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
}

start();

process.on('unhandledRejection', (err) => {
  console.error('[server] unhandled rejection:', err);
});
