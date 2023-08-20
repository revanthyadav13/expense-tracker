const Sequelize= require('sequelize');
const sequelize=require('../util/database');

const ContentUploaded = sequelize.define('contentUploaded', {
  userId:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
 url:{
    type: Sequelize.STRING,
    allowNull: false
 }
});

module.exports = ContentUploaded;
