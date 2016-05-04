var ObjectId = require('mongodb').ObjectId;

module.exports.user = function (req, res) {
  var id = req.params.id;
  if ()
}

module.exports.getUser = function(db, u_id, cb) {
  db.collection('users').findOne( { "_id": new ObjectId(u_id) }, function(err, doc) {
    if (err) {
      db.collection('users').findOne( { "email": u_id }, function(err, doc) {
        cb(err, doc);
      });
    } else {
      cb(err, doc);
    }
  });
};

module.exports.createUser = function(db, newInfo, cb) {
  db.collection('users').insertOne(newInfo, function(err, res) {
    res = null;
    err = 'yo';
    cb(err, res);
  });
};
