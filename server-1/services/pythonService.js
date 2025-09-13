const { spawn } = require('child_process');
const path = require('path');

const runPythonModel = (inputData) => {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [path.join(__dirname, '../python/predictor.py')]);

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

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(error));
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
