const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');
// const fs = require('fs');
const router = express.Router();

// router.param('id', tourController.checkID);
// router.param('id', tourController.checkBody);

//alias

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'), 
    tourController.getMonthlyPlan);
//route chained together
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'),
      tourController.createTour 
  );
  // .post(tourController.createTour); 
// .post(tourController.checkBody, tourController.createTour);  //middleware chained together
//   .route('/')
//   .get(getAllTours)
//   .post(createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),
  tourController.createTour)
  .delete(
    authController.protect, 
    // authController.restrictTo('admin'), 
    tourController.deleteTour);


//NESTED ROUTES

router.route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
    );

module.exports = router;