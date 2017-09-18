var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');


router.post('/user/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/user/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/user/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/user', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      user: false
    });
  }
  res.status(200).json({
    user: req.user
  });
});

router.post('/user', function(req, res) {//registrazione o update
  if(req.body._id) {//se sto facendo l'update

    if (!req.isAuthenticated()) {
      return res.status(200).json({
        error: 'Not logged'
      });
    }
    var userData = req.body;

    var userId = req.body._id;
    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete userData._id;
    
    User.update({_id : userId}, {"$set" : userData},function(error){console.log(error);});

    res.status(200).json({
      status: 'Update successful!'
    });

  } else {//se sto registrando

    User.register(new User(req.body),
      req.body.password, function(err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });

  }
});


module.exports = router;