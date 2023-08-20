const Sequelize= require('sequelize');
const sequelize=require('../util/database');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
   isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
  });

module.exports = ForgotPasswordRequest;
