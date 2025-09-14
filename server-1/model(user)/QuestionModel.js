const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  problem: String,
  options: Object, 
  correctAnswer: String, 
});

module.exports = mongoose.model('Question', questionSchema);
