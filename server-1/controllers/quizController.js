const QuizResult = require('../model(user)/QuizResult');
const User = require('../model(user)/userModel');
const Question = require('../model(user)/QuestionModel');
const express = require("express");
const router = express.Router();const jwt = require("jsonwebtoken");

// const path = require('path');
// const { spawn } = require('child_process');

// let latestQuiz = []; 

// //Function-1()

// const getQuizQuestions = (req, res) => {
//   const pyPath = path.join(__dirname, '../python/run_model.py');
//   const python = spawn('python3', [pyPath]);

//   let result = '';

//   python.stdout.on('data', (data) => {
//     result += data.toString();
//   });

//   python.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   python.on('close', (code) => {
//     try {
//       const output = JSON.parse(result);
//       const questions = output.map((q, idx) => ({
//         id: idx + 1,
//         problem: q.Problem,
//         options: q.options_dict,
//         correct: q.correct
//       }));

//       latestQuiz = questions; 

//       res.json({
//         user: { id: req.user._id, username: req.user.username },
//         questions,
//         scores: {},
//         finalLevel: 'Beginner'
//       });
//     } catch (e) {
//       res.status(500).json({ message: 'Invalid model output' });
//     }
//   });
// };


const path = require('path');
const { spawn } = require('child_process');



let latestQuiz = [];

const getQuizQuestions = (req, res) => {
  const pyPath = path.join(__dirname, '../python/run_model.py');
  const python = spawn('python3', [pyPath]);

  let result = '';

  python.stdout.on('data', (data) => {
    result += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    try {
      const output = JSON.parse(result);

      const questions = output.map((q, idx) => ({
        id: idx + 1,
        problem: q.problem,         // ✅ lowercase for consistency
        options: q.options,         // ✅ already a dict from Python
        correct: q.correct
      }));

      latestQuiz = questions;

      res.json({
        user: { id: req.user._id, username: req.user.username },
        questions,
        scores: {},
        finalLevel: 'Beginner'
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Invalid model output' });
    }
  });
};



const decodeToken = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      success: true,
      decoded,
    });
  } catch (err) {
    res.status(401).json({
      error: "Invalid or expired token",
      detail: err.message,
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    // ✅ Update user in DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skill },
      { new: true }
    );

    // ✅ Generate new token with skill included
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        specialization: user.specialization,
        stream: user.stream,
        skill: user.skill
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Skill updated successfully",
      skill: user.skill,
      token
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update skill", detail: err.message });
  }
};

const evaluateQuiz = async (req, res) => {
  const answers = req.body.answers;

  if (!answers || Object.prototype.toString.call(answers) !== "[object Object]") {
    return res.status(400).json({ message: "Invalid answers format" });
  }

  let score = 0;
  const results = [];

  for (const [questionId, userAnswer] of Object.entries(answers)) {
    const question = latestQuiz.find((q) => q.id === parseInt(questionId, 10));
    if (question) {
      const isCorrect =
        String(question.correct).toLowerCase() === String(userAnswer).toLowerCase();
      if (isCorrect) score += 1;
      results.push({
        questionId: question.id,
        correctAnswer: question.correct,
        userAnswer,
        isCorrect,
      });
    }
  }

  const totalQuestions = latestQuiz.length;
  const attempted = Object.keys(answers).length;
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Determine Level
  let level = "Beginner";
  if (percentage > 50 && percentage < 80) level = "Intermediate";
  else if (percentage >= 80) level = "Advanced";

  // Skill
  const skill = req.user?.skill || req.user?.specialization || "General";

  // Save result in DB
  try {
    const quizResult = await QuizResult.create({
      user: req.user._id,
      username: req.user.username,
      specialization: req.user.specialization,
      skill,
      level,
      totalQuestions,
      attempted,
      correctAnswers: score,
      percentage,
      results,
    });

    // Generate new token
    const token = jwt.sign(
      {
        id: req.user._id,
        username: req.user.username,
        specialization: req.user.specialization,
        skill,
        level,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Quiz evaluated & saved",
      quizResult,
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save quiz result", detail: err.message });
  }
};

const submitQuizResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers, score } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = new QuizResult({
      user: userId,
      username: user.username,
      answers,
      score,
    });

    await result.save();
    res.status(201).json({ message: 'Quiz result saved successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save result', error: error.message });
  }
};

const getUserResults = async (req, res) => {
  try {
    // req.user.id should come from your auth middleware (decoded JWT)
    const results = await QuizResult.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No quiz results found" });
    }

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch results",
      error: err.message,
    });
  }
};

//Function-2()

// === Function-2 (F2 Quiz) ===

const getF2QuizQuestions = (req, res) => {
  const python = spawn("python3", [path.join(__dirname, "../../model-f2/quiz_generator.py")]);
  let data = "";

  python.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  python.stderr.on("data", (err) => {
    console.error("❌ Python stderr:", err.toString());
  });

  python.on("close", () => {
    console.log("✅ Python stdout result:", data);

    try {
      res.json(JSON.parse(data));
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      res.status(500).json({ error: "Quiz generation failed" });
    }
  });
};

const evaluateQuizF2 = (req, res) => {
  const python = spawn("python3", [path.join(__dirname, "../../model-f2/evaluator.py")]);

  python.stdin.write(JSON.stringify({ answers: req.body.answers }));
  python.stdin.end();

  let result = "";
  python.stdout.on("data", (chunk) => (result += chunk.toString()));
  python.stderr.on("data", (err) => console.error("Evaluation Error:", err.toString()));

  python.on("close", () => {
    try {
      res.json(JSON.parse(result));
    } catch {
      res.status(500).json({ error: "Evaluation failed" });
    }
  });
};


module.exports = { 
  getQuizQuestions, submitQuizResult, getUserResults, evaluateQuiz, updateSkill, decodeToken,
  getF2QuizQuestions, evaluateQuizF2
 };
