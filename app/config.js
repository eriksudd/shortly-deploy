var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;




var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', function() {
  console.log("connected!!");
});



var urlsSchema = mongoose.Schema({
  url: {type: String, required: true, unique: true},
  baseUrl: {type: String, required: true},
  code: {type: String, required: true},
  title: {type: String, required: true},
  visits: { type: Number, default: 0 }
}, {timestamps: true});


var usersSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  baseUrl: {type: String, required: true},
  password: {type: String, required: true}
}, {timestamps: true});



var Url = mongoose.model('Url', urlsSchema);
var User = mongoose.model('User', usersSchema);

var google = new Url({
  url: 'www.google.com',
  baseUrl: 'google.com',
  code: 'somecode',
  title: 'google'
});

google.save();


var erik = new User({
  username: 'erik',
  baseUrl: 'whatever',
  password: 'password'
});

var steve = new User({
  username: 'steve',
  baseUrl: 'whatever',
  password: 'password'
});

erik.save();
steve.save();


















