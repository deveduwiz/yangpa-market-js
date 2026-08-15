const userService = require('../services/user.service');

const signUp = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const user = await userService.signUp({ email, name, password });
    res.json({ success: true, user, message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.signIn({ email, password });
    res
      .status(200)
      .json({ success: true, token, message: '로그인에 성공했습니다.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
