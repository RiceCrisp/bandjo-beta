var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');

exports.createUser = function(req, res) {
  req.db.collection('users').insertOne(res, function(err, res) {

  });
};

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

exports.addGenres = function(req, res) {
  var newGenre = req.query.add;
  var query = {'_id': new ObjectId(req.session.userID)};
  var operation = {$addToSet: {'genres': newGenre}};
  req.db.collection('users').updateOne(query, operation, function(err, results) {
    if (err) {
      // this isn't the right way of doing this
      res("error");
    } else {
      res.json(results);
    }
  });
};

exports.deleteGenres = function(req, res) {
  var genres = req.query.delete.split(',');
  var query = {$text: {$search: genres}};
  var operation = {$pullAll: {'genres': genres}};
  req.db.collection('users').updateOne(query, operation, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
};

exports.getGenres = function(req, res) {
  var genre = req.query.get;
  var query =
}

exports.addInfluences = function(req, res) {
  var newInfluence = req.query.add;
  var query = {'_id': new ObjectId(req.session.userID)};
  var operation = {$addToSet: {'influences': newInfluence}};
  req.db.collection('users').updateOne(query, operation, function(err, results) {
    if (err) {
      // this isn't the right way of doing this
      res("error");
    } else {
      res.json(results);
    }
  });
};

exports.deleteInfluences = function(req, res) {
  var influences = req.query.delete.split(',');
  var query = {'_id': new ObjectId(req.session.userID)};
  var operation = {$pullAll: {'influences': influences}};
  req.db.collection('users').updateOne(query, operation, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
};
