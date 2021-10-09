const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get Tour data from collection
  const tours = await Tour.find();

  // 2. Build the template
  // 3. Render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get Data for tour and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2. Build and render the template using data from step 1
  res
    .set('Content-Security-Policy', "default-src-elem 'https://api.mapbox.com'")
    .status(200)
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .set(
      'Content-Security-Policy',
      "default-src-elem 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.22.0/axios.min.js'"
    )
    .status(200)
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user,
  });
});
