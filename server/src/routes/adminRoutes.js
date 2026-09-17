const express = require('express');
const {
  getStats,
  listAllUsers,
  setUserStatus,
  deleteUser,
  listAllConversations,
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireAdmin);
router.get('/stats', getStats);
router.get('/users', listAllUsers);
router.patch('/users/:id/status', setUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/conversations', listAllConversations);

module.exports = router;
