var express = require('express');
var router = express.Router();
const controller = require('../controllers/user.controller');

router.post('/sign-Up', controller.signUp);
router.post('/sign-In', controller.signIn);

module.exports = router;
