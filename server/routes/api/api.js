// =======================
// API ROUTES
// =======================

var express = require('express');
var passport = require('passport');
var jwt = require("jwt-simple");
var moment = require('moment');//gestione date e tempo
var cfg = require("../../config.js");

var User = require('../../models/user.js');
var Transaction = require('../../models/transaction.js');

var adminRoutes = express.Router();
var userRoutes = express.Router();
var apiRoutes = express.Router();

module.exports = apiRoutes;

/**
 * Api di prova per fare testing
 */
apiRoutes.get('/prova', function(req, res) {
  res.status(200).json({
    message: "Complimenti, puoi accedere alle api"
  });
});

/**
 * @api {post} /api/login User login
 * @apiName Login
 * @apiGroup Api
 *
 * @apiParam {User} the user data--->mettere meglio
 */
apiRoutes.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    //Creazone del payload del token
    var payload = {
        id: user.id,
        sessionOpen:req.body.sessionOpen,
        expr:moment().add(cfg.timeSessionToken, "hours").unix()
    };
    //ho commentato maxAge perchè già c'è il parametro expr dentro al token. Da discutere se togliere expr e utilizzare maxAge
      res.cookie('token',jwt.encode(payload, cfg.jwtSecret), { /*maxAge: 900000,*/ httpOnly: true });
    //Codifica del token e restituzione
    //var token = jwt.encode(payload, cfg.jwtSecret);
    res.status(200).json({
        //token: token,
        status: 'Login successful!'
    });
  })(req, res, next);
});

/**
 * @api {post} /api/register User registration
 * @apiName Register
 * @apiGroup Api
 *
 * @apiParam {User} the user data--->mettere meglio
 */
apiRoutes.post('/register', function(req, res) {

  if (req.body.password.length < 8 || req.body.password.length > 100) {
    return res.status(500).json({
      err: 'Password must be between 8 and 100 characters long'
    });
  }


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

});
