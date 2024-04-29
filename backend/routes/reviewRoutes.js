const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/reviews', reviewController.getReviews);
router.post('/reviews', reviewController.addReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
