var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});
router.get('/u/:user',function(req,res){
  res.send('用户名');
});
router.use('/post',function(req,res){
  if(req.body['password-repeat'] != req.body['password']){
    req.flash('error','两次输入的密码不一致');
    return res.redirect('/reg');
  }

  //生成密码口令值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    name: req.body.username,
    password: password,
  });

  //检查用户名是否存在
  User.get(newUser.name,function(err,user){
    if(user)
      err = 'Username already exists.';
    if(err){
      req.flash('error',err);
      return res.redirect('/reg');
    }

    //如果不存在新增用户
    newUser.save(function(err){
      if(err){
        req.flash('error',err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success','注册成功');
      res.redirect('/');
    });
  });
});
router.use('/reg',function(req,res){
  res.render('reg',{title: '用户注册'});

});
router.use('/doReg',function(req,res){

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
