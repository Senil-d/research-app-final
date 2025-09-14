const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getQuizQuestions, submitQuizResult, getUserResults, validateAnswers, evaluateQuiz,
        getF2QuizQuestions, evaluateQuizF2
    } = require('../controllers/quizController');

//Function-1(Problem Solving)
router.get('/quiz', protect, getQuizQuestions);
router.post('/quiz/evaluate', protect, evaluateQuiz);

router.post('/submit', protect, submitQuizResult);
router.get('/my-', protect, getUserResults);

router.post('/validate-answers', protect, validateAnswers);

//Function-2()
router.get('/quiz-f2', getF2QuizQuestions);
router.post('/quiz-f2/evaluate-f2', evaluateQuizF2);

module.exports = router;
