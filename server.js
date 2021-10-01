const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// console.log(app.get('env'));
// console.log(process.env);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
