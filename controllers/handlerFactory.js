// const express = require('express');
// const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'Success',
        data: null,
      
      });
    });

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    // remember to change Postman setting from 'text' to 'JSON' in 'Raw'
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });
      
          if (!doc) {
            return next(new AppError('No document found with that ID', 404));
          }
      
          res.status(200).json({
            status: 'Success',
            // results: tours.length,
            data: {
              data: doc
            }
          });
        });

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
    data: doc
    }
  });
  });


  exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
     status: 'Success',
     data: {
       doc
     }
     });
    });


  exports.getAll = Model => catchAsync(async (req, res, next) => {

    // TO ALLOW FOR NESTED GET REVIEWS ON TOUR
    let filter = {}
    if (req.params.tourID) filter = { tour: req.params.tourID};


    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
  
  // SEND RESPONSE     
      res.status(200).json({
        status: 'Success',
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
          data: doc
        },
      });
    
  });