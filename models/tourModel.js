const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');


const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,      // removes white space on both ends
      maxlength: [40, 'A tour name must have less than 40 characters'],
      minlength: [10, 'A tour name must have more than 10 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'en-US', { ignore: ' ' });
        },
        message: 'Name should only contain alphabets',
      },
    
      // validate: [ validator.isAlpha, 'Tour name must only contain characters' ]  // example of using validator.js 
    },
    slug: String,
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'] 
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'] 
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['easy','medium', 'difficult'],
        message: 'This is not a valid difficulty level',
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // only works with new document 
          return val < this.price;
       },
       message: 'Discount price ({VALUE})should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true,      // removes white space on both ends
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true        // removes white space on both ends
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover']
    },
    images: [String],       // An array of strings
    createAt: {
      type: Date,
      default: Date.now(),
      select: false           // cannot be used as a sorting criteria
    },
    startDates: [Date],      // An array
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String, 
      description: String
    },
    locations:[{
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String, 
      description: String,
      day: Number
    }
  ],
      guides: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',

        }]
      },
    
  {
      toJSON: { virtuals: true  },
      toObject: { virtuals: true }
  });

  // VIRTUAL PROPERTIES
  tourSchema.virtual('durationWeeks')
  .get(function() {
      return this.duration / 7;
    });

      // VIRTUAL  POPULATE 
  tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });

    // Mongoose Middleware / Pre Document Middleware - runs only before .save() and .create(), but not .insertMany
    tourSchema.pre('save', function(next) {
      this.slug = slugify(this.name, {lower: true});
      next();
    });

    // // embed users data model into tours data model
    // tourSchema.pre('save', async function(next) {
    //   const guidesPromises = this.guides.map(async id => await User.findById(id));
    //   this.guides = await Promise.all(guidesPromises);
    //   next();
    // });

    // // Mongoose Middleware / Post Document Middleware - "save" is also called a hook
    // tourSchema.post('save', function(doc, next) {
    //   console.log(doc);
    //   next();
    // });

  // Mongoose Query Middleware / Pre "save"

    tourSchema.pre(/^find/, function(next) { 
      // Regex so the "find" function includes 'findOne' and 'findMany' methods
      // this.find({secretTour: false});
      this.find({secretTour: { $ne: true }});  // because the other tours aren't marked as "secret"
      this.start = Date.now();
      next();
    });

    tourSchema.pre(/^find/, function(next) {
      this.populate({
        path: 'guides',
        select: '-__v'
        // select: '-__v -passwordChangedAt'   //remove from display
      });
      next();
  });

    tourSchema.post(/^find/, function(docs, next) { 
      // Regex so the "find" function includes 'findOne' and 'findMany' methods
      // this.find({secretTour: false});
      console.log(`Query took ${Date.now() - this.start } milliseconds.`);
      console.log(docs);
      next();
    });

  // AGGREGATE MIDDLEWARE
  tourSchema.pre('aggregate', function(next) { 
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
    
  });

  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;
  