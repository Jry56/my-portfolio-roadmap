const express = require('express');
const { sendMessage, markRead } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/', sendMessage);
router.patch('/:id/read', markRead);

module.exports = router;
