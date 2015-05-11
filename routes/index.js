var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/u/:user',function(req,res){
  res.send('用户名');
});
router.use('/post',function(req,res){
  res.send('post');
});
router.get('/reg',function(req,res){
  res.send('reg');
});
router.use('/doReg',function(req,res){
  res.send('doReg');
});
router.get('/login',function(req,res){
  res.send('login');
});
router.use('/doLogin',function(req,res){
  res.send('doLogin');
});
router.get('/logout',function(req,res){
  res.send('logout');
});

module.exports = router;
