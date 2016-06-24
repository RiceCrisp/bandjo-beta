var express = require('express');
var app = module.exports = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
//var session = require('express-session');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var helmet = require('helmet');
var api = require('./assets/js/api.js');

var database;
var dbUrl = 'mongodb://localhost:27017/bandjo';

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {
  layout: false
});

app.use(helmet());
app.use(cookieParser());
app.use(cookieSession({secret: 'thisismysecret'}));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/routes', express.static(__dirname + '/routes'));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.ucfirst = function(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
};

MongoClient.connect(dbUrl, function(err, db) {
  "use strict";
  assert.equal(null, err);
  database = db;
  var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
  });
});

app.use('*', function(req, res, next) {
  if (req.session.userID) {
    api.autoLogin;
  }
  req.db = database;
  next();
});

app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

app.get('/api/user', api.getUser);
app.get('/api/autologin', api.autoLogin);
app.post('/api/login', api.loginUser);
app.get('/api/logout', api.logoutUser);
//app.get('/api/genre', api.getUsersByGenre);

app.use('*', function(req, res) {
  res.render('index');
  /*if (req.session.userID) {
    res.render('index', {'loggedInID': req.session.userID});
  } else {
    res.render('index', {'loggedInID': null});
  }*/
});

app.use(function(req, res) {
  res.sendStatus(404);
});
