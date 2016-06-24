var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');

exports.autoLogin = function(req, res) {
  var query = { '_id': new ObjectId(req.session.userID) };
  var projection = { '_id': 1, 'photo': 1, 'firstName': 1, 'lastName': 1 };
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      if (doc==null) {
        res.send('0');
      } else {
        req.session.userID = doc._id;
        res.json(doc);
      }
    }
  });
};

exports.loginUser = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
  var query = { 'email': email, 'password': hashedPassword };
  var projection = { '_id': 1, 'photo': 1, 'firstName': 1, 'lastName': 1 };
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      if (doc==null) {
        res.send('0');
      } else {
        req.session.userID = doc._id;
        res.json(doc);
      }
    }
  });
};

exports.logoutUser = function(req, res) {
  req.session = null;
  res.status(200).send('Success');
};

exports.getUser = function(req, res) {
  var u_id = req.query.id;
  var url = req.query.url;
  var email = req.query.email;
  console.log('User lookup values: id=' + u_id + ', url=' + url + ', email=' + email);
  var query = {};
  if (u_id) {
    query = {'_id': new ObjectId(u_id)};
  } else if (url) {
    query = {'link': url};
  } else if (email) {
    query = {'email': email};
  } else {
    query = {'_id': new ObjectId(req.session.userID)};
  }
  var projection = {'password': 0};
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      res("error");
    } else {
      res.json(doc);
    }
  });
};

exports.getUserByURL = function(req, res) {
  var link = req.params.link;
  console.log('Getting user by url ' + link);
  var query = { 'link': link };
  var projection = { 'password': 0 };
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      res("error");
    } else {
      res.json(doc);
    }
  });
};

exports.getUsers = function(req, res) {
  if (req.query.genre) {
    var genres = req.query.genre.split(',');
  } if (req.query.influence) {
    var influences = req.query.influence.split(',');
  } if (req.query.instrument) {
    var instruments = req.query.instrument.split(',');
  }
  //var query = {'genres': {$in: []};
  //var projection = {'_id': 0, 'firstName': 1, 'lastName': 1, 'photo': 1};
  //req.db.collection('users').findOne(query, projection, function(err, doc) {

  //});
  res.status(200).send('Success');
};

exports.updateUserByID = function(req, res) {
  var u_id = req.params.id;
  var query = { '_id': new Object(u_id) };
  //var update =
  //req.db.collection('users').update(query, )
};

exports.createUser = function(req, res) {
  req.db.collection('users').insertOne(res, function(err, res) {

  });
};
