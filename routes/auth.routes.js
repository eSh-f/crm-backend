const express = require("express");
const {register, login, githubOAuth} = require('../controller/auth.controller');
const validate = require('../middleware/validateRequest');
const {registerSchema} = require('../validators/userValidators');

const router = express.Router();

router.post("/register", validate(registerSchema) , register);
router.post("/login", login);
router.post("/github/callback", githubOAuth);

module.exports = router;