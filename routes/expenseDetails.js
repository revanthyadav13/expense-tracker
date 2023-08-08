
const express = require('express');

const expenseDetailsController = require('../controllers/expenseDetails');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseDetailsController.postRequestAddExpense);
router.get('/get-expenses', userAuthentication.authenticate, expenseDetailsController.getRequestExpenses);
router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseDetailsController.deleteRequestExpense);

module.exports = router;