var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

router.post('/', function(req, res) {
  var entry = new Entry();
  var newEntry = req.body.entry;

  entry.title = newEntry.title;
  entry.type = newEntry.type;
  entry.tags = newEntry.tags;
  entry.body = newEntry.body;
  entry.url = newEntry.url;
  entry.created = (new Date()).toISOString();
  entry.modified = (new Date()).toISOString();

  entry.save(function(err) {
    if (err)
      res.send(err);
    
    res.json({
      entry: entry

    });
  });
});

router.get('/', function(req, res) {
  Entry.find(function(err, entries) {
    if (err)
      res.send(err);

    res.json({
      entries: entries

    });
  });
});

router.get('/:entry_id', function(req, res) {
  Entry.findById(req.params.entry_id, function(err, entry) {
    if (err)
      res.send(err);

    var result = {
      entry: entry
    };

    res.json(result);

  });
});

router.put('/:entry_id', function(req, res) {
  Entry.findById(req.params.entry_id, function(err, entry) {
    if (err)
      res.send(err);

    var newEntry = req.body.entry;

    entry.title = newEntry.title;
    entry.type = newEntry.type;
    entry.tags = newEntry.tags;
    entry.body = newEntry.body;
    entry.url = newEntry.url;
    entry.modified = (new Date()).toISOString();

    entry.save(function(err) {
      if (err)
        res.send(err);

      res.json({
        entry: entry

      });
    });
  });
});

router.delete('/:entry_id', function(req, res) {
  Entry.remove({
    _id: req.params.entry_id

  }, function(err, entry) {
    if (err)
      res.send(err);

    res.send('He\'s deleted, Jim.');

  });
});

module.exports = router;

