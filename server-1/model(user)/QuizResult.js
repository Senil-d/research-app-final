const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String },
    skill: { type: String },
    level: { type: String },
    totalQuestions: { type: Number },
    attempted: { type: Number },
    correctAnswers: { type: Number },
    percentage: { type: Number },
    results: [
      {
        questionId: String,
        correctAnswer: String,
        userAnswer: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizResult", quizResultSchema);
