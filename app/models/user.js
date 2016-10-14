var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


/*
=======================================
USER SCHEMA
=======================================
*/

var UserSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  baseUrl: {type: String },
  password: {type: String, required: true}
}, {timestamps: true});





/*
=======================================
USER METHODS
=======================================
*/


UserSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });

});

UserSchema.methods.comparePassword = function(attemptedPassword, userPassword, cb) {
  console.log('calling compare password');
  bcrypt.compare(attemptedPassword, userPassword, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(isMatch);
  });
};


/*
=======================================
USER MODEL
=======================================
*/

var User = mongoose.model('User', UserSchema);


module.exports = User;