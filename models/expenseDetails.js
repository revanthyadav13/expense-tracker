const Sequelize= require('sequelize');
const sequelize=require('../util/database');


const ExpenseDetails = sequelize.define('expenseDetails', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
 expenseAmount:{
    type: Sequelize.INTEGER,
    allowNull: false
 },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
   category: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = ExpenseDetails;
