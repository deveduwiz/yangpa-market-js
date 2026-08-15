const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./models');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const salesRouter = require('./routes/sales');
const authorization = require('./middleware/authrization');

const app = express();
const PORT = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/members', usersRouter);
app.use('/sales', authorization, salesRouter);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB 연결 성공');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
  });
