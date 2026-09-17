const express = require('express');
const {
  listConversations,
  startConversation,
  getMessages,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', listConversations);
router.post('/', startConversation);
router.get('/:id/messages', getMessages);

module.exports = router;
