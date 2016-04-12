var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var crypto = require('crypto');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

    assert.equal(null, err);

    var msg = req.query.msg;

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
          res.render('home', {'results': results});
          console.log("Our query was: " + JSON.stringify(query));
          return db.close();
      }
    );

  });
});

app.post('/login', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

    assert.equal(null, err);

    var email = req.body.email;
    var password = req.body.password;
    var count = 0;

    var query = { "email": email };
    var projection = { "_id": 0, "password": 1 };
    var cursor = db.collection('users').find(query, projection);

    cursor.forEach(
      function(doc) {
        count++;
      }, function(err) {
        assert.equal(err, null);
        console.log("There were " + count + " matches.");
        if (count==1) {
          console.log("Found one user with that email.");
          db.close();
          if (password==doc.password) {
            console.log("Successfully logged in " + email + ".");
            res.redirect("/profile");
          } else {
            console.log("Password was incorrect")
            res.redirect("/?msg=1");
          }
        } else if (count==0) {
          console.log("No user found with that email.");
          db.close();
          res.redirect("/?msg=2");
        } else {
          console.log("What the hell.");
          db.close();
          res.redirect("/");
        }
      }
    );

  });
});

app.get('/profile', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

  });
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

    assert.equal(null, err);

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var now = new Date();
    var password = crypto.createHash("sha1").update(req.body.password).digest('hex');

    var query = { "firstName": firstName, "lastName": lastName, "email": email, "joinDate": now, "password": password };
    db.collection('users').insertOne(query, function(err, res) {
      assert.equal(err, null);
      console.log("User successfully created.");
      db.close();
      res.redirect("/login");
    });

  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Express server listening on port %s', port);
});
