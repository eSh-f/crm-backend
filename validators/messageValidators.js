const Joi = require('joi');

const messageSchema = Joi.object({
    order_id: Joi.number().integer().required(),
    sender_id: Joi.number().integer().required(),
    text: Joi.string().min(1).max(1000).required(),
});

module.exports = {
    messageSchema,
}; 