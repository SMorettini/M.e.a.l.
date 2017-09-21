// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var authenticate = require("./server/auth.js");

// mongoose
mongoose.connect('mongodb://localhost/meal');

// user schema/model
var User = require('./server/models/user.js');

// create instance of express
var app = express();

//define distdir
var distDir = __dirname + "/app/";
app.use(express.static(distDir));

// define middleware
app.use(express.static(path.join(__dirname, '../modules')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =======================
// API ROUTES
// =======================
var apiRoutes = require('./server/routes/api/api');
app.use('/api', apiRoutes);


// =======================
// USER ROUTES
// =======================
userRoutes = require('./server/routes/user/user');
app.use('/api/user',authenticate, userRoutes);


// =======================
// ADMIN ROUTES
// =======================
// POTREBBE NON ARRIVARCI MAI PERCHÈ IN AUTHENTICATE FACCIO SEND Error
// E NON SO SE DOPO CONTINUA O LÌ CHIUDE TUTTO
//var adminRoutes = require('./server/routes/admin/admin');
//app.use('/api/admin', adminRoutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/app', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(req, res);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
