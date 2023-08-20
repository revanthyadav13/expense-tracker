const ExpenseDetails = require('../models/expenseDetails');
const UserDetails = require('../models/userDetails');
const Sequelize= require('sequelize');
const sequelize=require('../util/database');

exports.getRequestLeaderBoard= async(req, res, next)=>{
            try{
              const {id, name, totalExpenses}=req.body;
        const userLeaderBoardDetails=    await UserDetails.findAll(
            {attributes: ['id', 'name', 'totalExpenses'],order: [[sequelize.col('totalExpenses'), 'DESC']]
      });    
      
res.status(200).json({userLeaderBoardDetails});
  }catch(error) {

    console.log(error)
    res.status(500).json({
      error: error.message 
    });
  }
}

