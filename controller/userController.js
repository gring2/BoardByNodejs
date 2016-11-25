
var bird = require('bluebird');
var UserModel;
var addUser = function(database, email, password,callback){
  console.log('addUser called');
  var result;
  UserModel = database.localUserModel;
  var user = new UserModel({"email": email, "password":password});

  user.save(function(err){
    if(err){
      callback(err, null);
      return;
    }
    console.log('UserAdded');
    callback(null,user);
  });
  console.log('result is %s',result);

  return result;
};

var authUser = function(email,password,dbModel){
  console.log('authUser called');
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
     console.error(err);
     throw(err);
   }
   );
}
exports.authUser = authUser;
exports.addUser = addUser;
