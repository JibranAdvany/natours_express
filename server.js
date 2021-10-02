const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
