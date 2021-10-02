const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Initializing express app
const app = express();

// Middleware

// Serving static assets
app.use(express.static(`${__dirname}/public`));

// Reading body data
app.use(express.json());

// custom middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🔥');
//   next();
// });

// Third-party middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Routing middle ware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// catch-all routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can not find ${req.originalUrl} on this server.`,
  // });

  const err = new Error(`Can not find ${req.originalUrl} on this server.`);
  err.status = 'fail';
  err.statusCode = 404;

  // If next function receives argument, express will direct the request to global error handler automatically.
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
