const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'User',
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      // },
      email: {
        type: DataTypes.STRING(50),
        // allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: 'user',
    },
  );
};
