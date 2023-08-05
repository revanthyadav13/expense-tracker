const path = require('path');

const express = require('express');

const userDetailsController = require('../controllers/userDetails');

const router = express.Router();

router.post('/signup', userDetailsController.postRequest);

module.exports = router;