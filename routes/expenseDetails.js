const path = require('path');

const express = require('express');

const expenseDetailsController = require('../controllers/expenseDetails');

const router = express.Router();

router.post('/add-expense', expenseDetailsController.postRequestAddExpense);
router.get('/get-expenses', expenseDetailsController.postRequestGetExpenses);
router.delete('/delete-expense/:id',expenseDetailsController.deleteRequestExpense);

module.exports = router;