const express = require('express');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const {
    getNotificationByUser,
    createNotification
} = require('../controller/notification.controller')

router.get('/:userId', auth, getNotificationByUser);
router.post('/', auth, createNotification);

module.exports = router;