const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup', userController.postRequestSignup);
router.post('/login', userController.postRequestLogin);

module.exports = router;