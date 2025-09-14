const { spawn } = require('child_process');
const path = require('path');

const runPythonModel = (inputData) => {
  return new Promise((resolve, reject) => {
    // Use 'python' instead of 'python3' for Windows compatibility
    const py = spawn('python', [path.join(__dirname, '../python/predictor.py')]);

    let output = '';
    let error = '';

    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      error += data.toString();
    });

    py.on('error', (err) => {
      reject(new Error(`Failed to start Python: ${err.message}`));
    });

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python process failed with code ${code}: ${error}`));
      }
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject(new Error('Failed to parse Python output: ' + output));
      }
    });
  });
};

module.exports = { runPythonModel };
