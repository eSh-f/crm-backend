const express = require('express');
const router = express.Router();
const {
    getNotificationByUser,
    createNotification
} = require('../controller/notification.controller')

router.get('/:userId', getNotificationByUser);
router.post('/', createNotification);

module.exports = router;