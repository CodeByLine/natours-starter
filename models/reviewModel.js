const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Tour = require('./tourModel');
const User = require('./userModel');

// one-to-many relationship
// parent referencing -- to prevent document grow indefinitely
const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
},
{
    toJSON: { virtuals: true  },
    toObject: { virtuals: true }

});

// tourSchema.pre(/^find/, function(next) { 
//     this.find({secretTour: { $ne: true }});  // because the other tours aren't marked as "secret"
//     this.start = Date.now();
//     next();
//   });

  reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'   //remove from display
  // })
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

  const Review = mongoose.model('Review', reviewSchema);

  module.exports = Review;
  