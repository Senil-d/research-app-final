const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Routes
const quizRoutes = require('./routes/quizRoutes'); 
const authRoutes = require('./routes/authRoutes');
const careerRoutes = require('./routes/careerRoute');
const quizResultRoutes = require('./routes/quizRoutes');
const validateAnswerRoutes = require('./routes/quizRoutes');
const leadershipAssessRoute = require('./routes/leadershipAssessRoute');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);

//Function-1(Problem Solving)
app.use('/api', quizRoutes);
app.use('/api/quiz-results', quizResultRoutes);
app.use('/api/answersQuiz', validateAnswerRoutes);

app.use('/api/career', careerRoutes);

//Function-2()
app.use('/f2-api', quizRoutes);

// Leadership Routes
app.use('/api/leadership', leadershipAssessRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`.cyan.bold);
});
