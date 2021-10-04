const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

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

// Import data to Mongo
const importData = async () => {
  try {
    await Tour.create(tours);

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
