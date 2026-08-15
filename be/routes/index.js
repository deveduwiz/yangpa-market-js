var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '양파마켓 API입니다.' });
});

module.exports = router;
