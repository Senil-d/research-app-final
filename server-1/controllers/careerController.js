const path = require('path');
const { spawn } = require('child_process');
const CareerLog = require('../model(user)/CareerLog');

const suggestCareer = async (req, res) => {
  const { stream, specialization } = req.body;

  // Get user from JWT middleware
  const userId = req.user._id;
  const username = req.user.username;

  const pyPath = path.join(__dirname, '../python/predict_career/predict_career.py');
  // Use 'python' instead of 'python3' for Windows compatibility
  const python = spawn('python', [pyPath]);

  const input = JSON.stringify({ stream, specialization });
  python.stdin.write(input);
  python.stdin.end();

  let result = '';
  let hasResponded = false; // Flag to prevent multiple responses

  python.stdout.on('data', data => {
    result += data.toString();
    console.log('Python output:', data.toString());
  });

  python.stderr.on('data', err => {
    console.error('Python error:', err.toString());
  });

  python.on('error', err => {
    console.error('Failed to start Python:', err);
    if (!hasResponded) {
      hasResponded = true;
      return res.status(500).json({ error: 'Python execution error', detail: err.message });
    }
  });

  python.on('close', async (code) => {
    if (hasResponded) return; // Prevent duplicate responses
    
    try {
      if (code !== 0) {
        hasResponded = true;
        return res.status(500).json({ error: 'Python process failed', code });
      }

      if (!result.trim()) {
        hasResponded = true;
        return res.status(500).json({ error: 'No output from Python script' });
      }

      const output = JSON.parse(result);

      if (output.error) {
        hasResponded = true;
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

      hasResponded = true;
      res.json({
        career: output.predicted_career,
        user: {
          id: userId,
          name: username
        }
      });
    } catch (err) {
      console.error('❌ Failed to parse output or save log:', err.message);
      if (!hasResponded) {
        hasResponded = true;
        res.status(500).json({ error: 'Prediction failed', detail: err.message });
      }
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
    // Use 'python' instead of 'python3' for Windows compatibility
    const python = spawn('python', [pyPath]);

    const input = { career };
    python.stdin.write(JSON.stringify(input));
    python.stdin.end();

    let result = '';
    let errorText = '';
    let hasResponded = false; // Flag to prevent multiple responses

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorText += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python:', err);
      if (!hasResponded) {
        hasResponded = true;
        return res.status(500).json({ error: 'Python execution error', detail: err.message });
      }
    });

    python.on('close', (code) => {
      if (hasResponded) return; // Prevent duplicate responses
      
      try {
        if (code !== 0) {
          hasResponded = true;
          return res.status(500).json({
            error: 'Python process failed',
            detail: errorText || `Process exited with code ${code}`,
          });
        }

        if (!result.trim()) {
          hasResponded = true;
          return res.status(500).json({ error: 'No output from Python script' });
        }

        const parsed = JSON.parse(result);
        hasResponded = true;
        return res.status(200).json(parsed);
      } catch (err) {
        if (!hasResponded) {
          hasResponded = true;
          return res.status(500).json({
            error: 'Failed to parse Python output',
            detail: errorText || err.message,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }
};

const saveCareerSelection = async (req, res) => {
  try {
    const { selectedCareer, stream, specialization } = req.body;
    const userId = req.user._id;

    const log = await CareerLog.create({
      user: userId,
      career: selectedCareer,
      stream,
      specialization
    });

    res.status(200).json({ message: 'Career saved successfully', log });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save career', detail: err.message });
  }
};

module.exports = { suggestCareer, getCareerRequiredSkills, saveCareerSelection };
