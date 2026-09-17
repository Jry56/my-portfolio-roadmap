const express = require('express');
const { listUsers, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', listUsers);
router.patch('/me', updateProfile);

module.exports = router;