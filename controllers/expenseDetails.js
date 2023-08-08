const ExpenseDetails = require('../models/expenseDetails');


exports.postRequestAddExpense =async (req, res, next)=>{

    try{
     const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;

    console.log(expenseAmount,description,category);
    const data= await ExpenseDetails.create({expenseAmount:expenseAmount, description:description,category:category,userId:req.user.id});
    res.status(201).json({newExpenseDetail:data});
    }catch(err){
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
  try {
    const expenseId = req.params.id;

     await ExpenseDetails.destroy({
      where: { id: expenseId ,userId:req.user.id}
    });

    res.status(200); 
  } catch(error) {
    res.status(500).json({
      error: error.message 
    });
  }
}