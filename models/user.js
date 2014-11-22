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
  console.log('debug: user token reset: %s', this.token);
  this.save();
});

UserSchema.statics.validateToken = function(token, cb) {
  console.log('debug: UserSchema validateToken token: %s', token);
  this.findOne({ token: token }, cb);
};

UserSchema.statics.createDefaultAdminUser = function() {
  var _this = this;
  this.findOne({}, function(err, user) {
    if (!user) {
      var adminUser = new _this;
      adminUser.username = "admin";
      bcrypt.genSalt(10, function(err, salt) {
        return bcrypt.hash("password", salt, function(err, hash) {
          adminUser.password = hash;
          adminUser.save();
        });
      });
    }
  });
};

module.exports = mongoose.model('User', UserSchema);

