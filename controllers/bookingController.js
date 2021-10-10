const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('./../utils/catchAsync');
const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getChekoutSession = catchAsync(async (req, res, next) => {
  // 1.  Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
        amount: tour.price * 100, // amount expected to be in cents
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3. Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});
