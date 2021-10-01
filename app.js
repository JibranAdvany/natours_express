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
app.use((req, res, next) => {
  console.log('Hello from the middleware 🔥');
  next();
});

// Third-party middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Routing middle ware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
