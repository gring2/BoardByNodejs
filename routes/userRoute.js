var userController = require('../controller/userController');

var signup = function(req,res,next){
  var email = req.body.email;
  var pw = req.body.pw;
  var db = req.app.get('db');
  var message ="";
 userController.authUser(email,pw,db.localUserModel)
  .then(function(){
    message = 'user있음';
    res.send({msg:message});
    }
  )
  .catch(function(err){
    if(err=='authenticate'){
        message = '비번오류';
        res.send({msg:message});
    }else{
      message=userController.addUser(db,email,pw,function(err,user){
        if(err) throw err;
        if(user){
            result = user;
            res.send({msg:result});
        }
      });
    }
  });
};
var signIn = function(req, res , next){
  console.log('upper %s', req.session.userEmail);

  var email = req.body.email;
  var pw = req.body.pw;
  var db = req.app.get('db');
  userController.authUser(email, pw, db.localUserModel)
  .then(function(user){
    req.session.userEmail = user.email;
    console.log('auth User %s ', req.session.userEmail);
    res.send({email:user.email});
  })
  .catch(function(err){
    if(err=='authenticate'){
      res.status(500).send({msg:'비번 오류'});
    }
    if(err=='user'){
      res.status(500).send({msg:'Not SignUped'});
    }
  });
};
var logOut = function(req, res, next){
console.log('LogOUt');
  var email = req.session.userEmail;
  console.log(email);
  if(email){
    req.session.destroy(function(err) {
      if(err) throw err;
      else{
          res.send({msg:'Outed'});
      }
    });
  }
};
module.exports.signIn=signIn;
module.exports.logOut=logOut;

module.exports.signup=signup;
