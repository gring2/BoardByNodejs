var local_logIn = require('./local_passport').local_logIn;
var local_signup = require('./local_passport').local_signup;
var facebookAuth = require('./Oauth_passport').facebookAuth;
var twitterAuth = require('./Oauth_passport').twitterAuth;
var googleAuth = require('./Oauth_passport').googleAuth;
//console.dir(require('./local_passport'));
module.exports=function(app,passport){
  passport.serializeUser(function(user, done) {
     var filteredUser = {email:user.email};
     done(null, filteredUser);
  });

  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
  passport.deserializeUser(function(user, done) {
       done(null, user);
  });
  passport.use('googleAuth', googleAuth(app,passport));
  passport.use('twitterAuth',twitterAuth(app,passport));
  passport.use('facebookAuth',facebookAuth(app,passport));
  passport.use('local_signup',local_signup);
  passport.use('local_logIn',local_logIn);
};
