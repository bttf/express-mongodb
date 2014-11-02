var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  token: String

});

UserSchema.method('validPassword', function(plaintext, cb) {
  return bcrypt.compare(plaintext, this.password, cb);
});

UserSchema.method('resetToken', function() {
  this.token = uuid.v4();
});

UserSchema.statics.validateToken = function(token, cb) {
  console.log('debug: UserSchema validateToken token: %s', token);
  this.findOne({ token: token }, cb);
};

module.exports = mongoose.model('User', UserSchema);

