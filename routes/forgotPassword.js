const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');


const router = express.Router();


router.post('/forgotpassword', forgotPasswordController.postForgotPassword);



module.exports = router;