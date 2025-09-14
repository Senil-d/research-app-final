const express = require('express');
const router = express.Router();

// Import controller functions
const {
  startSession,
  submitAnswer,
  getSummary,
} = require('../controllers/leadershipAssessController');

router.post('/start', startSession);
router.post('/submit', submitAnswer);
router.get('/summary/:session_token', getSummary);

module.exports = router;
