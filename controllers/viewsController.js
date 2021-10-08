const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

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

exports.getTour = catchAsync(async (req, res) => {
  // 1. Get Data for tour and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2. Build and render the template using data from step 1
  res
    .set('Content-Security-Policy', "default-src-elem 'https://api.mapbox.com'")
    .status(200)
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});
