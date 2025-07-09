const express = require('express');
const router = express.Router();

const {
    getReviewsForUser,
    createReview,
    deleteReview
} = require('../controller/review.controller');

const auth = require('../middleware/authMiddleware');


router.get('/:userId', auth, getReviewsForUser);
router.post('/', auth, createReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;