const ExpenseDetails = require('../models/expenseDetails');
const UserDetails = require('../models/userDetails');

const Sequelize= require('sequelize');
const sequelize=require('../util/database');

exports.getPremiumStatus =async (req, res, next)=>{

    try{
     
    const data= await UserDetails.findOne({ where: {id:req.user.id} });
    res.status(201).json({userDetail:data});
    }catch(err){
      console.log(err)
        res.status(500).json({
            error:err
        })
    }
   
}

exports.postRequestAddExpense =async (req, res, next)=>{
  const t = await sequelize.transaction();
    try{

      const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;
    const userId=req.user.id;
    const data = await ExpenseDetails.create({expenseAmount:expenseAmount, description:description, category:category, userId:userId},
      { transaction: t });

     const totalExpenses = await ExpenseDetails.sum('expenseAmount', {
      where: { userId: userId},
      transaction: t
    });

    
    await UserDetails.update({ totalExpenses: totalExpenses }, {
      where: { id: userId},
        transaction: t 
    });
       await t.commit();
    res.status(201).json({newExpenseDetail:data});
    }catch(err){
      await t.rollback();
      console.log(err)
        res.status(500).json({
            error:err
        })
    }
   
}

exports.getRequestExpenses =async (req, res, next)=>{

  try{
       const expenses= await ExpenseDetails.findAll({where:{userId:req.user.id}});
    res.status(200).json({allExpenses:expenses});
  }catch(error) {

    console.log(error)
    res.status(500).json({
      error: error.message 
    });
  }
 
  }


  exports.deleteRequestExpense= async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const deletedExpense = await ExpenseDetails.findOne({
      where: { id: expenseId, userId: userId },
      transaction: t
    });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await ExpenseDetails.destroy({
      where: { id: expenseId, userId: userId },
      transaction: t
    });

    const remainingExpenses = await ExpenseDetails.sum('expenseAmount', {
      where: { userId: userId },
      transaction: t
    });

    const totalExpenses = remainingExpenses || 0;

    await UserDetails.update(
      { totalExpenses: totalExpenses },
      {
        where: { id: userId },
        transaction: t
      }
    );

    await t.commit();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
}