const mongoose = require('mongoose');
const user = require('../models/user'); 
const expense = require('../models/expense'); 
const ContentUploaded = require('../models/contentUploaded');

const AWS = require('aws-sdk');

exports.getPremiumStatus = async (req, res, next) => {
  try {
    const data = await user.findById(req.user.id);
    res.status(201).json({ userDetail: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.postRequestAddExpense = async (req, res, next) => {
  try {
    const expenseAmount = req.body.expenseAmount;
    const description = req.body.description;
    const category = req.body.category;
    const userId = req.user._id; // Assuming req.user is the Mongoose User model

    // Create a new expense document
    const newExpenseDetail = await expense.create({
      expenseAmount,
      description,
      category,
      userId,
    });

    // Calculate the total expenses for the user
    const totalExpenses = await expense.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$expenseAmount' },
        },
      },
    ]);

    // Update the user's totalExpenses field
    await user.findByIdAndUpdate(userId, { totalExpenses: totalExpenses[0].total });

    res.status(201).json({ newExpenseDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRequestExpenses = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 5;

    const totalCount = await expense.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const expenses = await expense.find({ userId: req.user.id })
      .limit(itemsPerPage)
      .skip((currentPage - 1) * itemsPerPage);

    res.status(200).json({ allExpenses: expenses, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRequestExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id; // Assuming req.user is the Mongoose User model

    // Find and delete the expense
    const deletedExpense = await expense.findOneAndDelete({
      _id: expenseId,
      userId: userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Calculate the total expenses for the user
    const remainingExpenses = await expense.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$expenseAmount' },
        },
      },
    ]);

    // Update the user's totalExpenses field
    const totalExpenses = remainingExpenses.length > 0 ? remainingExpenses[0].total : 0;
    await user.findByIdAndUpdate(userId, { totalExpenses });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

function uploadToS3(data, filename) {
  const BUCKET_NAME = 'expensetracking13';
  const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3response) => {
      if (err) {
        console.log('Something went wrong', err);
        reject(err);
      } else {
        console.log('Success', s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.downloadExpenses = async (req, res, next) => {
  try {
    if (!req.user.ispremiumuser) {
      return res.status(401).json({ success: false, message: 'User is not a premium User' });
    }

    const expenses = await expense.find({ userId: req.user.id });
    console.log(expenses);
    const userId = req.user.id;

    const stringifiedExpense = JSON.stringify(expenses);
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpense, filename);

    const allContent = await ContentUploaded.create({ userId, url: fileUrl });

    res.status(200).json({ fileUrl, allContent, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false, message: 'Something went wrong' });
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage);

    const offset = (currentPage - 1) * itemsPerPage;

    const content = await ContentUploaded.find({ userId: req.user.id })
      .limit(itemsPerPage)
      .skip(offset)
      .sort({ createdAt: 'desc' });

    const totalCount = await ContentUploaded.countDocuments({ userId: req.user.id });

    res.status(200).json({ allContent: content, totalCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false, message: 'Something went wrong' });
  }
};
