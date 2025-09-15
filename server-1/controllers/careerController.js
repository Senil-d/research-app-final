const path = require('path');
const { spawn } = require('child_process');
const User = require('../model(user)/userModel');
const CareerLog = require('../model(user)/CareerLog');
const jwt = require("jsonwebtoken");

const suggestCareer = async (req, res) => {
  const { stream, specialization } = req.body;

  // Get user from JWT middleware
  const userId = req.user._id;
  const username = req.user.username;

  const pyPath = path.join(__dirname, '../python/predict_career/predict_career.py');
  const python = spawn('python3', [pyPath]);

  const input = JSON.stringify({ stream, specialization });
  python.stdin.write(input);
  python.stdin.end();

  let result = '';

  python.stdout.on('data', data => {
    result += data.toString();
    console.log('Python output:', data.toString());
  });

  python.stderr.on('data', err => {
    console.error('Python error:', err.toString());
  });

  python.on('error', err => {
    console.error('Failed to start Python:', err);
    return res.status(500).json({ error: 'Python execution error' });
  });

  python.on('close', async () => {
    try {
      const output = JSON.parse(result);

      if (output.error) {
        return res.status(400).json({ error: output.error });
      }

      const log = new CareerLog({
        stream,
        specialization,
        predictedCareer: output.predicted_career, // ✅ array saved directly
        user: userId,
        username: username
      });

      await log.save();

      res.json({
        career: output.predicted_career,
        user: {
          id: userId,
          name: username
        }
      });
    } catch (err) {
      console.error('❌ Failed to parse output or save log:', err.message);
      res.status(500).json({ error: 'Prediction failed', detail: err.message });
    }
  });
};

const getCareerRequiredSkills = async (req, res) => {
  try {
    const { career } = req.body;

    if (!career) {
      return res.status(400).json({ error: 'Career field is required' });
    }

    const pyPath = path.join(__dirname, '../python/predict_career/get_career_skills.py');
    const python = spawn('python3', [pyPath]);

    const input = { career };
    python.stdin.write(JSON.stringify(input));
    python.stdin.end();

    let result = '';
    let errorText = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorText += data.toString();
    });

    python.on('close', () => {
      try {
        const parsed = JSON.parse(result);
        return res.status(200).json(parsed);
      } catch (err) {
        return res.status(500).json({
          error: 'Failed to parse Python output',
          detail: errorText || err.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }
};

// const saveCareerSelection = async (req, res) => {
//   try {
//     const { selectedCareer, stream, specialization } = req.body;
//     const userId = req.user._id;

//     const log = await CareerLog.create({
//       user: userId,
//       career: selectedCareer,
//       stream,
//       specialization
//     });

//     res.status(200).json({ message: 'Career saved successfully', log });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to save career', detail: err.message });
//   }
// };


const saveCareerSelection = async (req, res) => {
  try {
    const { stream, specialization } = req.body;
    const userId = req.user._id;

    // ✅ Update user record
    const user = await User.findByIdAndUpdate(
      userId,
      { stream, specialization },
      { new: true }
    );

    // ✅ Generate new token with stream + specialization
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        stream: user.stream,
        specialization: user.specialization
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Career info saved successfully",
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save career info", detail: err.message });
  }
};



module.exports = { suggestCareer, getCareerRequiredSkills, saveCareerSelection };