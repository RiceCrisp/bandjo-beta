var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var crypto = require('crypto');
var helmet = require('helmet');
var am = require('./modules/account_manager');

var dbUrl = 'mongodb://localhost:27017/bandjo';

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(helmet());
app.use(cookieParser());
app.use(cookieSession({secret: 'thisismysecret'}));
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(dbUrl, function(err, db) {

  "use strict";
  assert.equal(null, err);

  app.get('/', function(req, res) {

    console.log('homepage');

    var errMsg = "";
    switch(req.query.err) {
      case 'login':
        errMsg = "You need to log in first"; break;
      case 'email':
        errMsg = "Incorrect email"; break;
      case 'password':
        errMsg = "Incorrect password"; break;
      case 'multi':
        errMsg = "Multiple accounts associated with that email"; break;
      default:
        break;
    }

    var results;
    var query = {};
    var projection = {"_id": 0, "firstName": 1, "lastName": 1, "instruments": 1, "photo": 1};
    var cursor = db.collection('users').find(query, projection);
    cursor.limit(1);

    cursor.forEach(
      function(doc) {
        results = doc;
      }, function(err) {
          assert.equal(err, null);
          res.render('home', {'results': results, 'errMsg': errMsg, 'email': req.query.email});
      }
    );

  });

  app.post('/login', function(req, res) {

    var password = req.body.password;
    //var password = crypto.createHash("sha1").update(req.body.password).digest('hex');
    am.manualLogin(db, req.body.email, password, function(res2, u_id) {
      switch(res2) {
        case 'success':
          req.session.userID = u_id;
          res.redirect("/profile");
          break;
        case "email":
          res.redirect("/?err=email&email=" + req.body.email); break;
        case 'password':
          res.redirect("/?err=password&email=" + req.body.email); break;
        case 'multi':
          res.redirect("/?err=multi&email=" + req.body.email); break;
        default:
          res.redirect("/"); break;
      }
    });

  });

  app.use(function(req, res, next) {
    if (req.session.testing==null) {
      console.log('Not logged in.');
      res.redirect("/?err=login");
      return;
    }
    console.log(req.session.testing);
    next();
  });

  app.get('/profile', function(req, res) {
    res.render('profile');
  });

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/signup', function(req, res) {

    var newInfo = {
      'firstName': req.body.firstName,
      'lastName': req.body.lastName,
      'email': req.body.email,
      'joinDate': new Date(),
      'password': crypto.createHash("sha1").update(req.body.password).digest('hex')
    }

    am.createUser(db, newInfo, function(res2) {
      switch(res2) {
      case 1:
        res.redirect("/?err=created"); break;
      default:
        res.redirect("/signup/?err=fail"); break;
      }
    });

  });

  app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
  });

  app.use(function(req, res) {
    res.sendStatus(404);
  });

  var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
  });

});
