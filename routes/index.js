var express = require('express');
var router = express.Router();
var passwordless = require('../lib/passwordless');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

module.exports = router;
