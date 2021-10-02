const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION.......Shutting Down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env);

// Database connection
const dbLink = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose.connect(dbLink, () => {
  console.log('Database connected!');
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION.......Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});
