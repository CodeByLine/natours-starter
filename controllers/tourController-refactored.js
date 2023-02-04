const express = require('express');
// const fs = require('fs');
// const Router = express.Router();
const Tour = require('./../models/tourModel');

// alias
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; 
  req.query.sort = '-ratingsAverage,price'; 
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
};

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  };
}

exports.getAllTours = async (req, res) => {
    // console.log(req.requestTime);
  try {
//BUILD QUERY    
    // const queryObj = { ...req.query };    // created a new object, instead of using the old one
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);
    // // const tours = await Tour.find(req.queryObj);
    // // const tours = await Tour.find(JSON.parse(req.queryObj));
    // // const tours = await Tour.find(JSON.parse(queryStr));
    // console.log(req.query, queryObj);

//// simple query
    // const query = await Tour.find(req.query);


// // ADVANCED QUERY / FILTERING 
//   let queryStr = JSON.stringify(queryObj);
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//   // console.log(JSON.parse(queryStr));

//     // const query = await Tour.find(JSON.parse(queryStr));
//     let query = Tour.find(JSON.parse(queryStr));

//     // const query = await Tour.find(queryObj);

//     // SORTING

//   if(req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     console.log(sortBy);
//     query = query.sort(sortBy);
//     // query = query.sort(req.query.sort);
//   } else {
//     query = query.sort('-createdAt');       // default sort
//   }

// // LIMIT FIELDS
//   if(req.query.fields) {
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
//   } else {
//     query = query.select('-__v');       // default 
//   }

// // PAGINATION
// const page = req.query.page * 1 || 1;      //default value
// const limit = req.query.limit * 1 || 100;      //default value
// const skip = (page - 1) * limit

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if(skip >= numTours) throw new Error('This page does not exist');
// } 

// console.log(query);
// console.log(page, limit);
// page=2&limit=10     1-10 >> page 1; 11-20 >> page 2; 21-30 >> page 3
// query = query.skip(2).limit(10)

// EXECUTE QUERY 
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
// query: wuery.sort().select().limit().skip().page();
    //// query example
        // const query = await Tour.find({
        // duration: 5,
        // difficulty: 'easy'
        // })

//// Mongoose query example
    // const query = await Tour.find()
      // .where('duration')
      // .equals(5)
      // .where('difficulty')
      // .equals('easy');
    
    // const tours = await Tour.find()

//// Mongoose queries
// { difficulty: 'easy', duration: {$gte: 5} }   

// SEND RESPONSE     
    res.status(200).json({
      status: 'Success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      // requestedAt: req.requestTime,
      message: err,
    });
  }
};
  
exports.getTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      
      // Tour.findOne({_id: req.params.id});
      res.status(200).json({
        status: 'Success',
        data: {
         tour
      }
    });

    } catch (err) {
      res.status(404).json({
        status: 'fail',
        // requestedAt: req.requestTime,
        message: err
      });
    };
  };
  
exports.createTour = async (req, res) => {
  try {
  // const newTour = new Tour({});
  // newTour.save();

    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'Success',
          data: {
            tour
          },
        
    });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err
      })
  };
}
  
exports.updateTour = async (req, res,) => {
  // remember to change Postman setting from 'text' to 'JSON' in 'Raw'
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'Success',
      // results: tours.length,
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      // requestedAt: req.requestTime,
      message: err
    });
  }
  };
  
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: 'Success',
      message: 'Tour deleted',
      // results: tours.length,
      data: null,
    
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      // requestedAt: req.requestTime,
      message: err
    });
  }
  };
  