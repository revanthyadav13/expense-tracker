const express = require('express');

const expenseDetailsController = require('../controllers/expenseDetails');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseDetailsController.postRequestAddExpense);
router.get('/get-expenses', userAuthentication.authenticate, expenseDetailsController.getRequestExpenses);
router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseDetailsController.deleteRequestExpense);
router.get('/get-premiumStatus', userAuthentication.authenticate, expenseDetailsController.getPremiumStatus);

router.get('/download', userAuthentication.authenticate, expenseDetailsController.downloadExpenses)
router.get('/getFiles', userAuthentication.authenticate, expenseDetailsController.getFiles)

module.exports = router;