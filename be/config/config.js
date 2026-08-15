require('dotenv').config();
module.exports = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 5),
  },
};
