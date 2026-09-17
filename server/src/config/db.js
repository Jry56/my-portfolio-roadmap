const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });

  console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });
}

module.exports = connectDB;
