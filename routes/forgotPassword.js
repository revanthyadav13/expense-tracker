const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

router.post('/forgotpassword', forgotPasswordController.postForgotPassword);
router.get('/resetpassword/:id', forgotPasswordController.getResetPassword);
router.get('/updatepassword/:resetpasswordid', forgotPasswordController.getUpdatePassword);

module.exports = router;