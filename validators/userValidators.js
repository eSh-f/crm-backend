const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role:  Joi.string().valid('client', 'freelancer').required(),
    name: Joi.string().min(2).required(),
});

const updateSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
    name: Joi.string().min(2),  //думал аватар тоже надо но это файл))
});

module.exports = {
    registerSchema,
    updateSchema,
}