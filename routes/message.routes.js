const express = require('express');
const router = express.Router();
const {
    getMessageByOrder,
    createMessage,
} = require('../controller/message.controller');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const { messageSchema } = require('../validators/messageValidators');

router.get('/order/:orderId', auth, getMessageByOrder);
router.post('/', auth, validate(messageSchema), createMessage);

module.exports = router;