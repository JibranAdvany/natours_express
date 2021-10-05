const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

dotenv.config({ path: './config.env' });

// Database connection
const dbLink = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
mongoose.connect(dbLink, () => {
  console.log('Database connected!');
});

// Reading the file (JSON)
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);

// Import data to Mongo
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data successfully loaded.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete already existing data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data successfully deleted.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] == '--import') {
  importData();
}
