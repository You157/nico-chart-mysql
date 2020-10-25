var express = require('express');
var router = express.Router();
const logger = require('../logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.Default.info('リクエストがありました');
  res.render('index');
});

module.exports = router;
