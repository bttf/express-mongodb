var express = require('express');
var router = express.Router();
var Bear = require('../models/bear');

router.post('/', function(req, res) {
  var bear = new Bear();

  bear.name = req.body.name;

  bear.save(function(err) {
    if (err)
      res.send(err);
    
    res.json({ message: "Bear created." });

  });
});

router.get('/', function(req, res) {
  Bear.find(function(err, bears) {
    if (err)
      res.send(err);

    res.json(bears);

  });
});

router.get('/:bear_id', function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err)
      res.send(err);

    res.json(bear);

  });
});

router.put('/:bear_id', function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err)
      res.send(err);

    bear.name = req.body.name;

    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear updated!' });

    });
  });
});

router.delete('/:bear_id', function(req, res) {
  Bear.remove({
    _id: req.params.bear_id

  }, function(err, bear) {
    if (err)
      res.send(err);

    res.json({ message: 'He\'s deleted, Jim.' });

  });
});

module.exports = router;

