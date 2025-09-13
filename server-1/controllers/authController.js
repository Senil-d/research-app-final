const User = require('../model(user)/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, password, email });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).send({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
//         res.json({ token, user });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
  
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };


const getUserById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const user = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};
  

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

module.exports = { register, login, updateUser, getUserById };
