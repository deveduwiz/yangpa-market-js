const Sequelize = require('sequelize');
const config = require('../config/config');
console.log(config);
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    ...config.db,
    define: {
      timestamps: true,
      paranoid: true,
    },
    logging: false,
  },
);

const User = require('./user')(sequelize);
const Sale = require('./sale')(sequelize);

User.hasMany(Sale, { foreignKey: 'email', sourceKey: 'email' });
Sale.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

module.exports = { sequelize, User, Sale };
