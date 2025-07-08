const express = require('express');
const router = express.Router();

const {
    getReviewsForUser,
    createReview,
    deleteReview
} = require('../controller/review.controller');

router.get('/:userId', getReviewsForUser);
router.post('/', createReview);
router.delete('/:id', deleteReview);

module.exports = router;