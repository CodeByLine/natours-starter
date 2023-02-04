const Review = require('./../models/reviewModel');
const express = require('express');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {}
//   if (req.params.tourID) filter = { tour: req.params.tourID};
    
//     const reviews = await Review.find(filter);


// // // SEND RESPONSE     
//     res.status(200).json({
//       status: 'Success',
//       requestedAt: req.requestTime,
//       results: reviews.length,
//       data: {
//         reviews
//       },
//     });
  
// });
  
  exports.getReview = catchAsync(async (req, res, next) => {

  const review = await Review.findById(req.params.id);
     
   if (!review) {
      return next(new AppError('No review found with that ID', 404));
   }
   res.status(200).json({
     status: 'Success',
     data: {
       review
   }
   });
  });
  
  exports.setTourUserIds = (req, res, next) => {
    //   //FOR NESTED ROUTES
  if(!req.body.tour) req.body.tour = req.params.tourId;
  if(!req.body.user) req.body.user = req.user.id;
  next();
  };
// exports.createReview = catchAsync(async (req, res, next) => {
//   //FOR NESTED ROUTES
//   if(!req.body.tour) req.body.tour = req.params.tourId;
//   if(!req.body.user) req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//         data: {
//           review: newReview
//         }, 
//   });
// });

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);