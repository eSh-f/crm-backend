const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const {  getAllUsers,
    createUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,} = require('../controller/user.controller');

const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const {registerSchema, updateSchema} = require('../validators/userValidators');

router.get('/',auth, getAllUsers);

router.post('/', upload.single('avatar'), validate(registerSchema) , createUser);

router.delete('/:id',auth, deleteUser);

router.get('/me', auth, getMyProfile);

router.put('/me', auth, upload.single('avatar'), validate(updateSchema) , updateMyProfile);

module.exports = router;

