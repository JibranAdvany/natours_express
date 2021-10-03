const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    records: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'info',
    message: 'The route is under development.',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'info',
    message: 'The route is under development.',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'info',
    message: 'The route is under development.',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'info',
    message: 'The route is under development.',
  });
};
