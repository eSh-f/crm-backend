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
    name: Joi.string().min(2),  
    github_username: Joi.string().allow(''),
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
});

module.exports = {
    registerSchema,
    updateSchema,
    changePasswordSchema,
}

