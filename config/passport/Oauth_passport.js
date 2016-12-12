var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var config = require('../config');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleAuth = function(app,passport){
  return  new googleStrategy({
    clientID: config.google.clientID
    ,clientSecret: config.google.clientSecret
    ,callbackURL : config.google.callbackURL
  }, function(accessToken, refreshToken, profile, done){
      console.log('passport facebook called');

      var options = {
        criteria : {'google.id' : profile.id}
        ,projection :{email: 1, provider: 1, name: 1}
      };

      var db = app.get('db');
//      console.dir(db.UserModel.load)
      db.UserModel.load(options, function(err, user){
        if(err) done(err);
        if(!user){
            var user = new db.UserModel({
              name: profile.displayName
              ,email: profile.emails[0].value
              ,provider: 'google'
              ,authToken: accessToken
              ,facebook: profile._json
            });
            user.save(function(err){
              if (err) console.log("err : %s",err);
              return done(err, user);
            });
          } else {
    				return done(err, user);
    			}
      })
  })
}

var facebookAuth = function(app,passport){
  return  new facebookStrategy({
    clientID: config.facebook.clientID
    ,clientSecret: config.facebook.clientSecret
    ,callbackURL : config.facebook.callbackURL
    	,profileFields: ['id', 'emails', 'name','displayName' ]
  }, function(accessToken, refreshToken, profile, done){
      console.log('passport facebook called');

      var options = {
        criteria : {'facebook.id' : profile.id}
        ,projection :{email: 1, provider: 1, name: 1}
      };

      var db = app.get('db');
//      console.dir(db.UserModel.load)
      db.UserModel.load(options, function(err, user){
        if(err) done(err);
        if(!user){
            var user = new db.UserModel({
              name: profile.displayName
              ,email: profile.emails[0].value
              ,provider: 'facebook'
              ,authToken: accessToken
              ,facebook: profile._json
            });
            user.save(function(err){
              if (err) console.log("err : %s",err);
              return done(err, user);
            });
          } else {
    				return done(err, user);
    			}
      })
  })
}

var twitterAuth = function(app,passport){
  return  new twitterStrategy({
    consumerKey: config.twitter.clientID
    ,consumerSecret: config.twitter.clientSecret
    ,callbackURL : config.twitter.callbackURL
  }, function(accessToken, refreshToken, profile, done){
      console.log('passport twitter called');

      var options = {
        criteria : {'twitter.id' : profile.id}
        ,projection :{email: 1, provider: 1, name: 1}
      };

      var db = app.get('db');
//      console.dir(db.UserModel.load)
      db.UserModel.load(options, function(err, user){
        if(err) done(err);
        if(!user){
            var user = new db.UserModel({
              name: profile.displayName
              ,email: profile.username
              ,provider: profile.provider
              ,authToken: accessToken
              ,facebook: profile._json
            });
            user.save(function(err){
              if (err) console.log("err : %s",err);
              return done(err, user);
            });
          } else {
    				return done(err, user);
    			}
      })
  })
}
  module.exports.facebookAuth = facebookAuth;
  module.exports.twitterAuth = twitterAuth;
  module.exports.googleAuth = googleAuth;
