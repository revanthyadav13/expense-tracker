const ExpenseDetails = require('../models/expenseDetails');


exports.postRequestAddExpense =async (req, res, next)=>{

    try{
     const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;

    console.log(expenseAmount,description,category);
    const data= await ExpenseDetails.create({expenseAmount:expenseAmount, description:description,category:category});
    res.status(201).json({newExpenseDetail:data});
    }catch(err){
        res.status(500).json({
            error:err
        })
    }
   
}

exports.postRequestGetExpenses =async (req, res, next)=>{

  try{
       const expenses= await ExpenseDetails.findAll();
    res.status(200).json({allExpenses:expenses});
  }catch(error) {
    res.status(500).json({
      error: error.message 
    });
  }
 
  }


  exports.deleteRequestExpense= async (req, res, next) => {
  try {
    const expenseId = req.params.id;

     await ExpenseDetails.destroy({
      where: { id: expenseId }
    });

    res.status(200); 
  } catch(error) {
    res.status(500).json({
      error: error.message 
    });
  }
}