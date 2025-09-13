// const jwt = require('jsonwebtoken');

// const protect = (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//         return res.status(401).send({ message: 'Not authorized now' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'secretKey');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).send({ message: 'Not authorized' });
//     }
// };

// const admin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).send({ message: 'Not authorized as admin' });
//     }
// };

// module.exports = { protect, admin };









const jwt = require('jsonwebtoken');
const User = require('../model(user)/userModel');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'secretKey');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
