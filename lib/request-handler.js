var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, (err, links) => {
    if (err) { throw err; } 

    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }).exec((err, found) => {
    if (err) { throw err; }

    if (found) {
      res.status(200).send(found);
    } else {

      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          res.sendStatus(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });

        newLink.save( (err, link) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).send(link);
          }

        });

      });
  

    }
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec( (err, user) => {
    console.log(user, 'user');
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, user.password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }

  });
   
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec((err, user) => {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save( (err, newUser) => {
          util.createSession(req, res, newUser);
        });

      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec((err, link) => {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;

      link.save( (err, link) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.redirect(link.url);
        }
      });
    }
  });
};














