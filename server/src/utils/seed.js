/**
 * Development-only helper: creates one admin account and a couple of demo
 * users so you have something to click through locally.
 * Run with: npm run seed
 * Safe to skip entirely in a real deployment.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function seed() {
  await connectDB();

  const accounts = [
    { name: 'Admin', email: 'admin@chatter.local', password: 'ChangeMe123!', role: 'admin' },
    { name: 'Amara Nwosu', email: 'amara@chatter.local', password: 'ChangeMe123!' },
    { name: 'Ben Okafor', email: 'ben@chatter.local', password: 'ChangeMe123!' },
  ];

  for (const account of accounts) {
    const exists = await User.findOne({ email: account.email });
    if (exists) {
      console.log(`[seed] skipping ${account.email} (already exists)`);
      continue;
    }
    await User.create(account);
    console.log(`[seed] created ${account.email}`);
  }

  console.log('[seed] done. Default password for all accounts: ChangeMe123!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
