var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var fruits = require('./routes/fruits');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var db = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    database: 'hdc_test',
    port: 3306,
    user: 'hdc',
    password: 'hdc'
  }
});


app.use(session({
  secret: 'MySEcr$tk#y',
  resave: false,
  saveUninitialized: true
}));

var auth = function (req, res, next) {
    console.log(req.session.username);
  if (req.session.logged) {
    next();
  } else {
      if (req.xhr) { // ajax
          res.send({ok: false, msg: 'Access dined.'});
      } else { // without ajax
          res.redirect('/users/login');
      }

  }
};

app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use('/fruits', fruits);
app.use('/users', users);
app.use('/', auth, routes);

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
