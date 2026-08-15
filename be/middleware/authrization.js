const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authorization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('JsonWebTokenError');
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.email = decoded.email;
    next();
  } catch (error) {
    throw error;
  }
};

module.exports = authorization;
