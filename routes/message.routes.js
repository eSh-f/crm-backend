const express = require('express');
const router = express.Router();
const {
    getMessageByOrder,
    createMessage,
} = require('../controller/message.controller');

router.get('/order/:orderId', getMessageByOrder);
router.post('/', createMessage);

module.exports = router;