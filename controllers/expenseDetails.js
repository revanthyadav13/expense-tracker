const ExpenseDetails = require('../models/expenseDetails');
const UserDetails = require('../models/userDetails');
const ContentUploaded=require('../models/contentUploaded');
const Sequelize= require('sequelize');
const sequelize=require('../util/database');
const AWS= require('aws-sdk');


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
       const { page, perPage } = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;

    const totalCount = await ExpenseDetails.count({ where: { userId: req.user.id } });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const offset = (currentPage - 1) * itemsPerPage;

    const expenses = await ExpenseDetails.findAll({
      where: { userId: req.user.id },
      limit: itemsPerPage,
      offset: offset,
    });

    res.status(200).json({ allExpenses: expenses, totalPages: totalPages });
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

function uploadToS3(data, filename){
  const BUCKET_NAME='expensetracking13';
  

  let s3bucket= new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey:process.env.IAM_USER_SECRET
    
  })
    

      var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
      }

      return new Promise((resolve,reject)=>{
         s3bucket.upload(params, (err,s3response)=>{
        if(err){
          console.log('something went wrong',err);
          reject(err);
        }else{
          console.log('success',s3response);
           resolve(s3response.Location);
        }
      })
})
     
    
}

exports.downloadExpenses =  async (req, res, next) => {
try {

   if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
    const expenses= await ExpenseDetails.findAll({where:{userId:req.user.id}});
    console.log(expenses);
    const userId=req.user.id;

    const stringifiedExpense= JSON.stringify(expenses);
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileUrl= await uploadToS3(stringifiedExpense, filename);
 const allContent= await ContentUploaded.create({userId:userId, url:fileUrl})
    res.status(200).json({fileUrl, allContent, success:true});
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'});
    }

};

exports.getFiles= async (req, res, next)=>{
  try{
     const { page, perPage } = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 10;

    const offset = (currentPage - 1) * itemsPerPage;

    const content = await ContentUploaded.findAndCountAll({
      where: { userId: req.user.id }, // Change as needed
      limit: itemsPerPage,
      offset: offset,
      order: [['createdAt', 'DESC']], // Order by creation date (modify as needed)
    });

    const totalCount = content.count; // Get the total count of files

    res.status(200).json({ allContent: content.rows, totalCount });
  }catch(err){
    res.status(500).json({ error: err, success: false, message: 'Something went wrong'});

  }
}