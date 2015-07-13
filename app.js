/**
 * Module dependencies.
 */

var express = require('express'),
    app = express(),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    db = require('./models/dbMongoose'),
    settings = require('./settings');

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
// app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(logger('dev'));
// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
app.use(cookieParser());
// when the sessions will be stored in db.
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.session.success || null;
    res.locals.error = req.session.error || null;
    req.session.success = null;
    req.session.error = null;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// development only
// if ('development' == app.get('env')) {
//     app.use(express.errorHandler());
// }

// router or controller
routes(app);

app.on('close', function(err) {
    db.disconnect();
});

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// socket.io
require('./websocket_blog')(server);