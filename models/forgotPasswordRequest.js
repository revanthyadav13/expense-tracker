const mongoose = require('mongoose');

const forgotPasswordRequestSchema = new mongoose.Schema({
 id: {
    type: String, // Mongoose uses String for UUID
    default: () => uuidv4(),
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true,
  },
  isactive: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const ForgotPasswordRequest = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);

module.exports = ForgotPasswordRequest;
