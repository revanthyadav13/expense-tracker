const Premium = require('../models/premium');
const ExpenseDetails = require('../models/expenseDetails');
const UserDetails = require('../models/userDetails');

const Sequelize= require('sequelize');
const sequelize=require('../util/database');

exports.getRequestLeaderBoard= async(req, res, next)=>{
            try{
        const userLeaderBoardDetails=    await UserDetails.findAll(
            {attributes: ['id', 'name',[sequelize.fn('SUM', sequelize.col('ExpenseDetails.expenseAmount')), 'totalExpense']],
            include:[
                 {
                    model:ExpenseDetails,
                     attributes:[]
                }
            ]
               
            ,
      group: ['UserDetails.id'],
      order: [[sequelize.col('totalExpense'), 'DESC']]
      });    
      
res.status(200).json({userLeaderBoardDetails});
  }catch(error) {

    console.log(error)
    res.status(500).json({
      error: error.message 
    });
  }
}

