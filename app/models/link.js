var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

/*
=======================================
LINK SCHEMA
=======================================
*/

var LinkSchema = mongoose.Schema({
  url: {type: String, required: true, unique: true},
  baseUrl: {type: String, default: 'http://127.0.0.1:4568' },
  code: {type: String},
  title: {type: String},
  visits: { type: Number, default: 0 }
}, {timestamps: true});




/*
=======================================
USER METHODS
=======================================
*/


LinkSchema.pre('save', function(next) {
  var link = this;

  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
});


/*
=======================================
LINK MODEL
=======================================
*/

var Link = mongoose.model('Link', LinkSchema);


module.exports = Link;