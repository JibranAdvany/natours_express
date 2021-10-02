const { query } = require('express');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // 1A. FILTERING (Basic)
    // Created a hard copy of the object using destructuring.
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Object.keys(object) - will return an array on which we can then iterate.
    // below statement iterates over excluded fields and delete the respective object keys
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B. FILTERING (Advanced)
    let queryStr = JSON.stringify(queryObj); // to add $ sign
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2. SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // It will do in ascending order (-) for descending order
    } else {
      query = query.sort('-createdAt price');
    }

    // 3. FIELD LIMITING - only specific fields (Projecting)
    if (req.query.fields) {
      const fieldsSelect = req.query.fields.split(',').join(' ');
      query = query.select(fieldsSelect);
    } else {
      query = query.select('-__v');
    }

    // 4. PAGINATION
    const maxResults = req.query.limit * 1 || 10;
    const jumpResults = (req.query.page * 1 - 1) * maxResults || 0;
    query = query.skip(jumpResults).limit(maxResults);

    // Send response
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'The resource you are looking for does not exist.',
      error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'The resource you are looking for does not exist.',
      error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent.',
      error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID sent or resource does not exist.',
      error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Deleted',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID or resource does not exist.',
      error,
    });
  }
};
