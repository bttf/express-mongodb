var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  token: String,
  valid: Boolean,
  username: String

});

module.exports = mongoose.model('Session', SessionSchema);

