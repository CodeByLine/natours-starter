const express = require('express');
const reviewController = require('../controllers/reviewController');


const authController = require('../controllers/authController');
// const fs = require('fs');
const router = express.Router({mergeParams: true}); // allow reviews access to tourId

router.use(authController.protect);

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        // authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds, 
        reviewController.createReview);
        

router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview); // AUTH later

module.exports = router;