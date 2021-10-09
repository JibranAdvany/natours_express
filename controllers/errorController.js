const AppError = require('../utils/appError');

const handleJWTExpiredError = err => {
  return new AppError('Your token has expired. Please login again', 401);
};

const handleJWTError = err => {
  return new AppError('Invalid token. Please login again', 401);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value ${err.keyValue.name} Please use another value.`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack,
    });
  } else {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const handleInvalidUpdatesDB = err => {
  const msgArray = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input data. ${msgArray.join(' ')}`;

  return new AppError(message, 400);
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational errors that we trust
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or other unknown error. Don't want to leak error details to client.
      // 1. Log error
      console.error('ERROR 🔥', err);

      // 2. Send generic message
      return res.status(500).json({
        status: 'error',
        message: `Something went wrong.`,
      });
    }
  } else {
    return res.status(res.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === 'Validation failed')
      error = handleInvalidUpdatesDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
