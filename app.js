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
var am = require('./assets/js/account_manager');

var database;
var dbUrl = 'mongodb://localhost:27017/bandjo';

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(helmet());
app.use(cookieParser());
app.use(cookieSession({secret: 'thisismysecret'}));
app.use('/assets', express.static(__dirname + '/assets'));
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

app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

app.get('/api/user/:id', function(req, res) {
  var id = req.params.id;
});

app.use('/', function(req, res) {
  var results;
  var query = {};
  var projection = {"_id": 0, "firstName": 1, "lastName": 1, "instruments": 1, "photo": 1};
  var cursor = database.collection('users').find(query, projection);
  cursor.limit(1);
  cursor.forEach(
    function(doc) {
      results = doc;
    }, function(err) {
        assert.equal(err, null);
        res.render('index', {'results': results, 'errMsg': 'test', 'email': req.query.email});
    }
  );
});

app.use('*', function(req, res) {
  var results;
  var query = {};
  var projection = {"_id": 0, "firstName": 1, "lastName": 1, "instruments": 1, "photo": 1};
  var cursor = database.collection('users').find(query, projection);
  cursor.limit(1);
  cursor.forEach(
    function(doc) {
      results = doc;
    }, function(err) {
        assert.equal(err, null);
        res.render('index', {'results': results, 'errMsg': 'test', 'email': req.query.email});
    }
  );
});

/*
app.get('/partials/:name', function(req, res, next) {
  res.render('partials/' + req.params.name);
});


app.use('*', function(req, res, next) {
  if (req.session.userID) {
    res.locals.loggedIn = true;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

app.get('/', function(req, res) {
  var errMsg;
  switch(req.query.err) {
    case 'login':
      errMsg = "You need to log in first"; break;
    case 'email':
      errMsg = "Incorrect email"; break;
    case 'password':
      errMsg = "Incorrect password"; break;
    case 'multi':
      errMsg = "Multiple accounts associated with that email"; break;
    case 'created':
      errMsg = "Account created"
    default:
      break;
  }
  var results;
  var query = {};
  var projection = {"_id": 0, "firstName": 1, "lastName": 1, "instruments": 1, "photo": 1};
  var cursor = database.collection('users').find(query, projection);
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

app.use(function(req, res) {
  res.sendStatus(404);
});

  app.post('/login', function(req, res) {
    var password = req.body.password;
    var password = crypto.createHash("sha1").update(req.body.password).digest('hex');
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

  app.get('/profile/:id', function(req, res) {
    am.getUser(db, req.params.id, function(err2, doc2) {
      if (err2) {
        assert.equal(null, err2);
      }
      if (req.session.userID==doc2._id) {
        res.render('profile', {"user": doc2, "edit": true});
      } else {
        res.render('profile', {"user": doc2, "edit": false});
      }
    });
  });

  app.get('/profile', function(req, res) {
    if (req.session.userID) {
      am.getUser(db, req.session.userID, function(err2, doc2) {
        res.render('profile', {"user": doc2, "edit": true});
      });
    } else {
      res.redirect("/?err=login");
    }
  });

  app.post('/signup', function(req, res) {
    var newInfo = {
      'firstName': req.body.firstName,
      'lastName': req.body.lastName,
      'email': req.body.email,
      'joinDate': new Date(),
      'password': crypto.createHash("sha1").update(req.body.password).digest('hex')
    }
    am.createUser(db, newInfo, function(err2, res2) {
      if (res2) {
        res.redirect("/?err=created");
      } else {
        res.redirect("/signup/?err=fail&firstName="+req.body.firstName+"&lastName="+req.body.lastName+"&email="+req.body.email);
      }
    });
  });

  app.get('/signup', function(req, res) {
    var errMsg;
    var prevInfo;
    switch (req.query.err) {
      case 'fail':
        errMsg = "Failed to create user"
      default:
        break;
    }
    prevInfo = {
      'firstName': req.query.firstName,
      'lastName': req.query.lastName,
      'email': req.query.email
    }
    res.render('signup', {"prevInfo": prevInfo, "errMsg": errMsg});
  });

  // Public urls go before here
  app.use(function(req, res, next) {
    if (req.session.userID==null) {
      console.log('Not logged in.');
      res.redirect("/?err=login");
      return;
    }
    console.log("UserID: "+req.session.userID);
    next();
  });

  app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
  });
*/
