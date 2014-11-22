var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('./models/user');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.mongo_host + ':' + config.mongo_port + '/chewbonga');

User.createDefaultAdminUser();

var entries = require('./routes/entries');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

// passport
//
passport.use(new BearerStrategy(
  function(token, done) {
    console.log('debug: BearerStrategy');
    User.validateToken(token, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {
  console.log('debug: localStrategy');
  User.findOne({
    username: username

  }, function(err, user) {
    if (err) {
      console.log('debug: localStrategy: err');
      return done(err);
    }

    if (!user) {
      console.log('debug: localStrategy: !user');
      return done(null, false);
    }

    user.validPassword(password, function(err, valid) {
      if (valid) {
        console.log('debug: localStrategy: valid');
        user.resetToken();
        user.save();
        done(null, user);
      }
      else {
        console.log('debug: localStrategy: invalid password');
        return done(null, false);
      }
    });
  });
}));

// enable CORS for development
app.use(cors());
app.options('*', cors());

// routes
app.use('/auth', passport.authenticate('local', { session: false }), function(req, res, next) {
  res.json({
    token: req.user.token
  });
});

app.use(function(req, res, next) {
  if (req.headers['token']) {
    req.query['access_token'] = req.headers['token'];
  }
  else if (req.body['token']) {
    req.query['access_token'] = req.body['token'];
  }
  next();
});

app.use('/validate', passport.authenticate('bearer', { session: false }), function(req, res) {
  res.status(200).send('OK');
});

app.use('/logout', passport.authenticate('bearer', { session: false }), function(req, res) {
  req.user.resetToken();
  req.logout();
  res.status(200).send('OK');
});

app.use('/entries', entries);
app.use('/users', passport.authenticate('bearer', { session: false }), users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found\n');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  console.log('debug: error handler, 404, \'error, sorry\'');
  res.status(err.status || 500);
  res.send('error, sorry.\n');
});

module.exports = app;

