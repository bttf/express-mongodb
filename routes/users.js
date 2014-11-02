var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var User = require('../models/user');

router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json({
      users: users

    });
  });
});

router.post('/', function(req, res, next) {
  var user = new User();

  if (req.body.username && req.body.password) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        user.username = req.body.username;
        user.password = hash;
        user.token = uuid.v4();

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
});

router.get('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);

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
  });
});

router.delete('/:user_id', function(req, res, next) {
  User.remove({
    _id: req.params.user_id

  }, function(err, user) {
    if (err)
      res.send(err);

    res.send('He\'s deleted, Jim.');

  });
});

module.exports = router;

