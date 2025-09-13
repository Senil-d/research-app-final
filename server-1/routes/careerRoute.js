const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { suggestCareer, getCareerRequiredSkills, saveCareerSelection } = require('../controllers/careerController');

router.post('/suggest-career', protect, suggestCareer);
router.post('/career-skills', protect, getCareerRequiredSkills);

router.post('/save-selection', protect, saveCareerSelection);

module.exports = router;
