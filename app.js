var express = require('express');
//express-partials
var partials = require('express-partials');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));

app.use(function(req,res,next){
  console.log('app.usr local');
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
})

app.use('/', routes);
app.listen(3000);
console.log("something happening");
app.use('/users', users);
//app.get('/u/:user',routes);
//app.post('/post',routes);
//app.get('/reg',routes);
//app.post('/reg',routes);
//app.get('/login',routes);
//app.post('/login',routes);
//app.get('/logout',routes);

//检测用户名是否存在在
//var users = {
//  'yujia' : {
//    name : 'Raincal',
//    website : 'www.cyj228.com'
//  }
//};
//app.all('/user/:username',function(req,res,next){
//  if(users[req.params.username]){
//    next();
//  }else{
//    next(new Error(req.params.username + ' dose not exit.'));
//  }
//});
//app.get('/user/:username',function(req,res){
//  res.send(JSON.stringify(users[req.params.username]));
//});
//app.put('/user/:username',function(req,res){
//  res.end('Done.');
//});

//片段视图(partials)
//app.get('/list',function(req,res){
//  res.render('list',{
//    title : 'List',
//    items : [1994,'Raincal','express','Nodejs']
//  });
//});

//视图助手
/*var util= require('util');
/!*express3.x
  app.locals({
  inspect : function(obj){
    return util.inspect(obj,true);
  }
});*!/
app.locals.inspect = function(obj){
  return util.inspect(obj,true);
};
app.use(function(req,res,next){
  res.locals.headers = req.headers;
  next();
});
app.get('/helper',function(req,res){
  res.render('helper',{
    title : 'Helpers'
  });
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
