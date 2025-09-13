// server/routes/authRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const { register, login, updateUser, getUserById } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', protect, getUserById);
router.put('/update-user/:id', protect, updateUser);


module.exports = router;
