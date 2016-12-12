
var bird = require('bluebird');
var UserModel;
var addUser = function(database, email, password){
  var result;
  UserModel = database.UserModel;
  return new bird(function(resolve,reject){
    var user = new UserModel({"email": email, "password":password});

    user.save(function(err){
      if(err){
        reject('save error')
      }
      resolve(user);
    });
  })
  .catch(function(err){
    throw err;
  });

};

var authUser = function(email,password,dbModel){
  UserModel = dbModel;
  var result =null;
return new bird(function(resolve, reject){

    UserModel.findUser(email,function(err,user){
      if(err) reject('err');
      else resolve(user);
    });
  })
  .then(function(user){
    return new bird(function(resolve,reject){
       if(!user) reject('user')
       else{
         var authedUser = new UserModel({email : user.email});
          var authenticate = authedUser.authenticate(password,user._doc.salt,user._doc.hashed_password);
         if(!authenticate) reject('authenticate');
         else{
          resolve(authedUser);
         }
       }
    });
  })
   .catch(function(err){
     throw(err);
   }
   );
}
module.exports.authUser = authUser;
module.exports.addUser = addUser;
