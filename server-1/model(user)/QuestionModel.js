const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  problem: String,
  options: Object, // like { A: "Option A", B: "Option B", ... }
  correctAnswer: String, // "A", "B", etc.
});

module.exports = mongoose.model('Question', questionSchema);
