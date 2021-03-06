var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var User = require('../models/user');
var passport = require('passport');
var auth = passport.authenticate.bind(passport, 'bearer', { session: false });

router.get('/', function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json({
      users: users

    });
  });
});

router.post('/', function(req, res) {
  var user = new User();
  var username = req.body.user.username;
  var password = req.body.user.password;

  if (username && password) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        user.username = username;
        user.password = hash;
        user.token = uuid.v4();

        user.save(function(err) {
          console.log('username', user.username);
          console.log('password', user.password);
          if (err)
            res.send(err);

          res.json({
            user: user

          });
        });
      });
    });
  }
  else {
    next();
  }
});

router.get('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

    if (!user)
      next();

    res.json({
      user: user

    });
  });
});

router.put('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

    if (req.body.username && req.body.password) {
      user.username = req.body.username;

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          user.password = hash;

          user.save(function(err) {
            if (err)
              res.send(err);

            res.json({
              user: user

            });
          });
        });
      });
    }
    else {
      next();
    }
  });
});

router.delete('/:user_id', function(req, res, next) {
  User.remove({
    _id: req.params.user_id

  }, function(err, user) {
    if (err) {
      res.send(err);
    }

    if (!user) {
      next();
    }

    res.json({});
  });
});

module.exports = router;

