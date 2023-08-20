const express = require('express');

const premiumController = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', userAuthentication.authenticate, premiumController.getRequestLeaderBoard);

module.exports = router;