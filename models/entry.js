var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  title: String,
  type: String,
  tags: [],
  body: String,
  url: String,
  created: Date,
  modified: Date

});

module.exports = mongoose.model('Entry', EntrySchema);

