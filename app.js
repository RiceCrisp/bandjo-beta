var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var engines = require('consolidate')
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.engine('html', engines.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

    assert.equal(null, err);

    var query = {};
    var projection = {"_id": 0, "firstName": 1};
    var cursor = db.collection('users').find(query, projection);

    cursor.forEach(
      function(doc) {
        res.render('home', {'results': doc})
      }, function(err) {
          assert.equal(err, null);
          console.log("Our query was: " + JSON.stringify(query));
          return db.close();
      }
    );
  });
});

app.post('/signup', function(req, res) {
  MongoClient.connect('mongodb://localhost:27017/bandjo', function(err, db) {

    assert.equal(null, err);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var now = new Date();
    var password = req.body.password;

    var query = { "firstName": firstName, "lastName": lastName, "email": email, "joinDate": now, "password": password };
    db.collection('users').insertOne(query, function(err, res) {
      assert.equal(err, null);
      console.log("User successfully created.");
      return db.close();
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
