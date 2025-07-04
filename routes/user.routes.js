const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../controller/user.controller');

router.get('/', getAllUsers);

module.exports = router;

