const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');

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

// catch-all route
app.all('*', (req, res, next) => {
  // If next function receives argument, express will direct the request to global error handler automatically.
  next(new AppError(`Can not find ${req.originalUrl} on this server.`, 404));
});

// Error handling middleware
app.use(errorController);

module.exports = app;
