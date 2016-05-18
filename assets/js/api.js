var ObjectId = require('mongodb').ObjectId;

exports.loginUser = function(req, res) {
  var password = req.body.password;
  var hashedPassword = crypto.createHash("sha1").update(req.body.password).digest('hex');
  var query = { "email": email, "password": hashedPassword };
  var projection = {};
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      req.session.userID = doc._id;
    }
  });
};

exports.logoutUser = function(req, res) {
  req.session.destroy();
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
  var query = {'link': link};
  var projection = {'password': 0};
  req.db.collection('users').findOne(query, projection, function(err, doc) {
    if (err) {
      res("error");
    } else {
      res.json(doc);
    }
  });
};

exports.updateUserByID = function(req, res) {
  var u_id = req.params.id;
  var query = {'_id': new Object(u_id)};
  //var update =
  //req.db.collection('users').update(query, )
};

exports.createUser = function(req, res) {
  req.db.collection('users').insertOne(res, function(err, res) {

  });
};
