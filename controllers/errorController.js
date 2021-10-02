const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value ${err.keyValue.name} Please use another value.`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const handleInvalidUpdatesDB = err => {
  const msgArray = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input data. ${msgArray.join(' ')}`;

  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  // Operational errors that we trust
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error. Don't want to leak error details to client.
    // 1. Log error
    console.error('ERROR 🔥', err);

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: `Something went wrong.`,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === 'Validation failed')
      error = handleInvalidUpdatesDB(error);

    sendErrorProd(error, res);
  }
};