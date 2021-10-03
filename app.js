const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // to protect against DOS attacks
const helmet = require('helmet'); // secured HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // protects against sql injections
const xss = require('xss-clean'); // protects against malicious HTML attacks
const hpp = require('hpp'); // protects against parameter pollution
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Initializing express app
const app = express();

// Middleware

// Helmet
app.use(helmet());

// Serving static assets
app.use(express.static(`${__dirname}/public`));

// Reading body data
app.use(express.json({ limit: '10kb' }));

// Data sanitization middleware (against no sql query injection and against CSS attacks)
app.use(mongoSanitize());

// XSS
app.use(xss());

// Parameter Pollution Preventor
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// custom middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🔥');
//   next();
// });

// app.use((req, res, next) => {
//   console.log(req.headers);

//   next();
// });

// Third-party middleware
// LIMITER
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Routing middle ware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// catch-all route
app.all('*', (req, res, next) => {
  // If next function receives argument, express will direct the request to global error handler automatically.
  next(new AppError(`Can not find ${req.originalUrl} on this server.`, 404));
});

// Error handling middleware
app.use(errorController);

module.exports = app;
