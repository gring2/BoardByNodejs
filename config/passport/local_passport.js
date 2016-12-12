var userController = require('../../controller/userController')

var LocalStrategy = require('passport-local').Strategy

var local_logIn = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'pw',
        passReqToCallback : true
    }
    ,function(req,userid, password, done) {
      console.log('logIN logIn');
      var db=  req.app.get('db');
      userController.authUser(userid, password, db.UserModel)
      .then(function(user){
        done(null,user);
      })
      .catch(function(err){
        console.log("err err %s",err );
        if(err=='authenticate'){
              done(null,false);
        }
        if(err=='user'){
          done(null,false);
        }
      });

    }
);

var local_signup = new LocalStrategy({
  usernameField : 'email',
  passwordField : 'pw',
  passReqToCallback : true

},function(req,userid,password,done){
  console.log("signUp");
  var db=  req.app.get('db');
  userController.authUser(userid, password, db.UserModel)
  .then(function(user){
    console.log('auth User %s ', user.email);

    done(null,false);
  })
  .catch(function(err){
    if(err=='authenticate'){
          done(null,false);
    }
    if(err=='user'){
      console.log("user called");
      userController.addUser(db,userid,password)
      .then(function(user){
        done(null,user);
      })
      .catch(function(err){
        console.log(err);
      });
    }
  });
});
module.exports.local_logIn = local_logIn;
module.exports.local_signup = local_signup;
