var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String

});

UserSchema.method('validPassword', function(plaintext, cb) {
  return bcrypt.compare(plaintext, this.password, cb);
});

module.exports = mongoose.model('User', UserSchema);

