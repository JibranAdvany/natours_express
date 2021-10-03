const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email ID.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid email address.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Password should have at least 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (val) {
        return this.password === val;
      }, // It will only work on save and create commands
      message: 'Passwords provided do not match.',
    },
  },
});

// Encrypting the passwords. User passwords must not be saved as plain text (MOST IMPORTANT RULE)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // if password is not modified.

  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm field
  this.passwordConfirm = undefined;

  next();
});

// Checking password for login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
