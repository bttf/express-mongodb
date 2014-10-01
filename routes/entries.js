var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

router.post('/', function(req, res) {
  var entry = new Entry();

  entry.title = req.body.title;
  entry.type = req.body.type;
  entry.tags = req.body.tags;
  entry.body = req.body.body;
  entry.url = req.body.url;
  entry.created = (new Date()).toISOString();
  entry.modified = (new Date()).toISOString();

  entry.save(function(err) {
    if (err)
      res.send(err);
    
    res.json({ message: "Entry created.\n" });

  });
});

router.get('/', function(req, res) {
  Entry.find(function(err, entries) {
    if (err)
      res.send(err);

    var results = {
      entries: entries
    };
    
    res.json(results);

  });
});

router.get('/:entry_id', function(req, res) {
  Entry.findById(req.params.entry_id, function(err, entry) {
    if (err)
      res.send(err);

    res.json(entry);

  });
});

router.put('/:entry_id', function(req, res) {
  Entry.findById(req.params.entry_id, function(err, entry) {
    if (err)
      res.send(err);

    // debug
    // console.log(JSON.stringify(req.body));
    
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

      res.json({ message: 'Entry updated.' });

    });
  });
});

router.delete('/:entry_id', function(req, res) {
  Entry.remove({
    _id: req.params.entry_id

  }, function(err, entry) {
    if (err)
      res.send(err);

    res.json({ message: 'He\'s deleted, Jim.' });

  });
});

module.exports = router;

