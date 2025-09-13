const QuizResult = require('../model(user)/QuizResult');
const User = require('../model(user)/userModel');
const Question = require('../model(user)/QuestionModel');

const path = require('path');
const { spawn } = require('child_process');

let latestQuiz = []; 

//Function-1()

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
        problem: q.Problem,
        options: q.options_dict,
        correct: q.correct
      }));

      latestQuiz = questions; // ✅ Store current quiz for evaluation

      res.json({
        user: { id: req.user._id, username: req.user.username },
        questions,
        scores: {},
        finalLevel: 'Beginner'
      });
    } catch (e) {
      res.status(500).json({ message: 'Invalid model output' });
    }
  });
};

const evaluateQuiz = (req, res) => {
  const answers = req.body.answers;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'Invalid answers format' });
  }

  let score = 0;
  const results = [];

  for (const [questionId, userAnswer] of Object.entries(answers)) {
    const question = latestQuiz.find(q => q.id === parseInt(questionId));
    if (question) {
      const isCorrect = question.correct === userAnswer;
      if (isCorrect) score += 1;

      results.push({
        questionId: question.id,
        correctAnswer: question.correct,
        userAnswer,
        isCorrect
      });
    }
  }

  res.json({
    username: req.user.username,
    totalQuestions: latestQuiz.length,
    attempted: Object.keys(answers).length,
    correctAnswers: score,
    percentage: Math.round((score / latestQuiz.length) * 100),
    results
  });
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
    const results = await QuizResult.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch results', error: err.message });
  }
};

const validateAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    const results = [];

    for (let item of answers) {
      const { questionId, selectedOption } = item;

      const question = await Question.findById(questionId);
      if (!question) {
        results.push({
          questionId,
          correct: false,
          message: 'Question not found',
        });
        continue;
      }

      const isCorrect = question.correctAnswer === selectedOption;
      results.push({
        questionId,
        selectedOption,
        correctAnswer: question.correctAnswer,
        correct: isCorrect,
      });
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Function-2()

const getF2QuizQuestions = (req, res) => {
  const pyPath = path.join(__dirname, '../../model-f2/run/quiz_generator.py');
  const python = spawn('python3', [pyPath], { encoding: 'utf8' });

  let data = '';
  python.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  python.stderr.on('data', (err) => {
    console.error('❌ Python stderr:', err.toString());
  });

  python.on('close', (code) => {
    console.log('✅ Python stdout result:', data);
    if (!data || data.trim() === '') {
      console.error('❌ Python script returned empty output');
      return res.status(500).json({ error: 'Quiz generation failed: Empty output' });
    }

    try {
      const output = JSON.parse(data);
      res.json(output);
    } catch (e) {
      console.error('❌ JSON parse error:', e);
      console.error('❌ Raw output was:', data);
      res.status(500).json({ error: 'Quiz generation failed: Invalid JSON output' });
    }
  });
};

const evaluateQuizF2 = (req, res) => {
  const pyPath = path.join(__dirname, '../../model-f2/run/evaluator.py');
  const python = spawn('python3', [pyPath], { encoding: 'utf8' });

  // Send answers to Python script via stdin
  const input = JSON.stringify({ answers: req.body.answers });
  python.stdin.write(input);
  python.stdin.end();

  let result = '';
  python.stdout.on('data', (chunk) => {
    result += chunk.toString();
  });

  python.stderr.on('data', (err) => {
    console.error('❌ Python stderr:', err.toString());
  });

  python.on('close', (code) => {
    console.log('✅ Python stdout result:', result);
    if (!result || result.trim() === '') {
      console.error('❌ Python script returned empty output');
      return res.status(500).json({ error: 'Evaluation failed: Empty output' });
    }

    try {
      const output = JSON.parse(result);
      res.json(output);
    } catch (e) {
      console.error('❌ JSON parse error:', e);
      console.error('❌ Raw output was:', result);
      res.status(500).json({ error: 'Evaluation failed: Invalid JSON output' });
    }
  });
};


module.exports = { 
  getQuizQuestions, submitQuizResult, getUserResults, validateAnswers, evaluateQuiz,
  getF2QuizQuestions, evaluateQuizF2
 };
