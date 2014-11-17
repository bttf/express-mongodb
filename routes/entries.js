var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');
var User = require('../models/user');
var passport = require('passport');
var auth = passport.authenticate.bind(passport, 'bearer', { session: false });

router.post('/', auth(), function(req, res) {
  var entry = new Entry();
  var newEntry = req.body.entry;

  entry.title = newEntry.title;
  entry.type = newEntry.type;
  entry.tags = newEntry.tags;
  entry.body = newEntry.body;
  entry.url = newEntry.url;
  entry.created = (new Date()).toISOString();
  entry.modified = (new Date()).toISOString();
  entry.isDraft = newEntry.isDraft;

  entry.save(function(err) {
    if (err)
      res.send(err);

    res.json({
      entry: entry

    });
  });
});

router.get('/', function(req, res, next) {
  console.log('debug get request for entires');
  Entry.find(function(err, entries) {
    console.log('debug: entries, get: Entry.find');
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

    res.json({
      entry: entry

    });
  });
});

router.put('/:entry_id', auth(), function(req, res, next) {
  Entry.findById(req.params.entry_id, function(err, entry) {
    if (err)
      res.send(err);

    if (req.body.entry) {
      var newEntry = req.body.entry;

      if (newEntry.title)
        entry.title = newEntry.title;
      if (newEntry.type)
        entry.type = newEntry.type;
      if (newEntry.tags)
        entry.tags = newEntry.tags;
      if (newEntry.body)
        entry.body = newEntry.body;
      if (newEntry.url)
        entry.url = newEntry.url;

      entry.modified = (new Date()).toISOString();
      entry.isDraft = newEntry.isDraft || false;

    }


    if (entry) 
      entry.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          entry: entry

        });
      });
      else
        next();
  });
});

router.delete('/:entry_id', auth(), function(req, res) {
  Entry.remove({
    _id: req.params.entry_id

  }, function(err, entry) {
    if (err) {
      res.send(err);
    }

    res.json({});

  });
});

module.exports = router;

