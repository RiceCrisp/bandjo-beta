exports.getUser = function(req, res) {
  var u_id = req.params.id;
  console.log('did it with ' + u_id);
  res.json({
    'id': u_id
  });
  /*
  db.collection('users').findOne( { "_id": new ObjectId(u_id) }, function(err, doc) {
    if (err) {
      db.collection('users').findOne( { "email": u_id }, function(err, doc) {
        cb(err, doc);
      });
    } else {
      cb(err, doc);
    }
  });
  */
};

module.exports.createUser = function(db, newInfo, cb) {
  db.collection('users').insertOne(newInfo, function(err, res) {
    res = null;
    err = 'yo';
    cb(err, res);
  });
};
