const express = require('express');
// const fs = require('fs');
// const Router = express.Router();
const User = require('./../models/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const fs = require('fs');
// const users = fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8');
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);


exports.checkID = (req, res, next, val) => {
  // console.log(`User id is: ${val}`);
  

  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'Error',
      message: 'User not found'
    });
  };
  next();
  };

  
//route chained together


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // return res.json(users);
  res.status(200).json({
    status: 'Success',
    data: {
      users: users,
    },
  });
  });
  
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.'
    // data: {
    //   user,
    // },
  });
  };

exports.getMe = (req, res, next) => {
  request.params.id = req.user.id;
  next();
};

  // USER DELETS ACCOUNT
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'Success',
    data: null
  });
});

exports.updateMe = factory.updateOne(User);
// exports.updateMe = catchAsync(async (req, res, next) => {
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError( 
//         'This route is not for password updates. Please use /updateMyPassword.',
//         400
//       )
//       )};

//   res.status(204).json({
//     status: 'Success',
//     data: null
//   });
// });

  
// exports.getUser = catchAsync(async(req, res, next) => {
//     const id = await req.params.id * 1; // convert fr string to number
//     // const user = await users.find((el) => el.id === id);
//     const user = await User.findById(req.params.id);

    
//     if (!user) {
//       return next(new AppError('No user found with that ID', 404));
//    }
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         user,
//       },
//     });
    
//     console.log(user);

//   });
  
// exports.updateUser = (req, res, next) => {
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       user: '<Updated User Here>',
//     },
//   });
//   };

  exports.getAllUsers = factory.getAll(User);
  exports.getUser = factory.getOne(User);

  // Do NOT update password using the following update function
  exports.updateUser = factory.updateOne(User);
  // exports.updateReview = factory.updateOne(Review);
  exports.deleteUser = factory.deleteOne(User);
  
  
// exports.deleteUser = (req, res) => {
//     res.status(204).json({
//       data: null,
//     });
//   };