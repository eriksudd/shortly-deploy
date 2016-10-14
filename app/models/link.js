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
LINK MODEL
=======================================
*/

var Link = mongoose.model('Link', LinkSchema);

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


module.exports = Link;



// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
