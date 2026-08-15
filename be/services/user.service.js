const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  bcrypt: { saltRounds },
  jwt: { secret, expiresIn },
} = require('../config/config');

console.log(saltRounds, secret, expiresIn);
const signUp = async ({ email, name, password }) => {
  const hashed = await bcrypt(password, saltRounds);
  const user = await User.create({ email, name, hashed });
  return { email: user.email, name: user.name };
};

const signIn = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error('존재하지 않은 이메일입니다.');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.status = 401;
    throw error;
  }

  return jwt.sign({ email: user.email }, secret, {
    expiresIn: expiresIn,
  });
};

module.exports = { signUp, signIn };
