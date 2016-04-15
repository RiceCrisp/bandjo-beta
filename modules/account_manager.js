module.exports.manualLogin = function(db, email, password, cb) {

  var u_id;
  var count = 0;
  var dbpassword = "";
  var cursor = db.collection('users').find( { "email": email }, { "_id": 1, "password": 1 } );

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
          cb("password");
        }
      } else if (count===0) {
        console.log("No user found with that email.");
        cb("email");
      } else {
        console.log("Multiple emails found.");
        cb("multi");
      }
    }
  );
};

module.exports.autoLogin = function(db, email, password) {

};

module.exports.createUser = function(db, newInfo, cb) {
  db.collection('users').insertOne(newInfo, function(err, res) {
    cb(err, res);
  });
};
