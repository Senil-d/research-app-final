const mongoose = require('mongoose');

const careerLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  stream: String,
  specialization: String,
  career: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerLog', careerLogSchema);
