const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name can not exceed 40 characters.'],
      minlength: [10, 'A tour name must have at least 10 characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can only be easy, medium or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating can not be below 1.'],
      max: [5, 'Rating can not be over 5.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'Discount price ({VALUE}) should be below the regular price.',
        validator: function (value) {
          // this function is not going to work on update.
          return value < this.price;
        },
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true, // trim only works for strings.
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // for referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  // below is mandatory for virtual properties to show
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties - can not be called in a query.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate for reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// (document, query , aggregate, model) middleware
// DOCUMENT MIDDLEWARE
// =====================
// pre-save middleware - Runs before the document is saved (only works with save() and create())
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Embedding Example
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// post-save middleware
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });

// QUERY MIDDLEWARE runs before or after the query is returned.
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// tourSchema.post(/^find/, function (doc, next) {
//   doc[0].name = 'abc'; // it will not alter the document but only the returned result.

//   next();
// });

// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
