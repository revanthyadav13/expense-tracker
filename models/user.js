const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ispremiumuser: {
    type: Boolean,
    default: false // Assuming default value is false
  },
  totalExpenses: {
    type: Number,
    default: 0 
  }
});


const User = mongoose.model('user', userSchema);

module.exports = User;
