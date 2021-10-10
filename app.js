const path = require('path');
const express = require('express');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // to protect against DOS attacks
const helmet = require('helmet'); // secured HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // protects against sql injections
const xss = require('xss-clean'); // protects against malicious HTML attacks
const hpp = require('hpp'); // protects against parameter pollution
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Initializing express app
const app = express();
app.enable('trust proxy');

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware

// Helmet
app.use(helmet());

// Serving static assets
app.use(express.static(path.join(__dirname, 'public')));

// Reading body data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization middleware (against no sql query injection and against CSS attacks)
app.use(mongoSanitize());

// XSS
app.use(xss());

// Parameter Pollution Prevent
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

app.use((req, res, next) => {
  // console.log(req.cookies);

  next();
});

app.use(compression());

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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// catch-all route
app.all('*', (req, res, next) => {
  // If next function receives argument, express will direct the request to global error handler automatically.
  next(new AppError(`Can not find ${req.originalUrl} on this server.`, 404));
});

// Error handling middleware
app.use(errorController);

module.exports = app;
