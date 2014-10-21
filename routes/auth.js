var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var Session = require('../models/session');
var User = require('../models/user');

// debug
//
// router.get('/', function(req, res, next) {
//   Session.find(function(err, results) {
//     if (err)
//       res.send(err);
// 
//     res.json(results);
// 
//   });
// });

router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
      username: username

    }, function(err, user) {
      bcrypt.compare(password, user.password, function(err, valid) {
        if (valid) {
          // remove existing sessions
          Session.remove({
            username: username,
            valid: true

          }, function(err) {
            if (err) 
              res.send(err);

          });

          var session = new Session();

          session.token = uuid.v1();
          session.valid = true;
          session.username = username;

          session.save(function(err) {
            if (err)
              res.send(err);

            res.json({
              session: session

            });
          });
        }
        else 
          next();

      });
    });
  }
  else
    next();
});

router.delete('/', function(req, res) {
  Session.remove({
    username: req.body.username,
    valid: true

  }, function(err, session) {
    if (err) 
      res.send(err);

    res.json(session);

  });
});

module.exports = router;

