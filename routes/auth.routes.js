const express = require("express");
const {register, login} = require('../controller/auth.controller');
const validate = require('../middleware/validateRequest');
const {registerSchema} = require('../validators/userValidators');

const router = express.Router();

router.post("/register", validate(registerSchema) , register);
router.post("/login", login);

module.exports = router;