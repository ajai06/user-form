var express = require('express');
var router = express.Router();
var userHandler = require('../controller/handler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//register
router.post('/register', userHandler.registerAction);

//login 
router.post('/login', userHandler.loginAction);

module.exports = router;
