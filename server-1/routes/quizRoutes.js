const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getQuizQuestions, submitQuizResult, getUserResults, evaluateQuiz,updateSkill,decodeToken,
        getF2QuizQuestions, evaluateQuizF2
    } = require('../controllers/quizController');

//Function-1(Problem Solving)
router.get('/quiz', protect, getQuizQuestions);
router.post("/update-skill", protect, updateSkill);

router.post('/evaluate', protect, evaluateQuiz);
router.get("/decode", decodeToken);


router.post('/submit', protect, submitQuizResult);
router.get("/results", protect, getUserResults);
// router.post('/validate-answers', protect, validateAnswers);

//Function-2()
router.get('/quiz-f2', getF2QuizQuestions);
router.post('/quiz-f2/evaluate-f2', evaluateQuizF2);

module.exports = router;
