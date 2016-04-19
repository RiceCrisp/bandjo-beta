var ObjectId = require('mongodb').ObjectId;

module.exports.manualLogin = function(db, email, password, cb) {

  var u_id;
  var count = 0;
  var dbpassword = "";
  var cursor = db.collection('users').find( { "email": email }, { "password": 1 } );

  cursor.forEach(
    function(doc) {
      dbpassword = doc.password;
      u_id = doc._id;
      count++;
    }, function(err) {
      console.log("There were " + count + " matches.");
      if (count==1) {
        console.log("Found one user with that email.");
        if (password==dbpassword) {
          console.log("Successfully logged in " + email + ".");
          cb("success", u_id);
        } else {
          console.log("Password was incorrect");
          cb("password", 0);
        }
      } else if (count===0) {
        console.log("No user found with that email.");
        cb("email", 0);
      } else {
        console.log("Multiple emails found.");
        cb("multi", 0);
      }
    }
  );
};

module.exports.autoLogin = function(db, email, password) {

};

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
    cb(err, res);
  });
};
