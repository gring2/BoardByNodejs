module.exports=function(app,passport){

  app.post('/signIn',passport.authenticate('local_logIn'),
    function(req,res) {
      console.log("callback");
      console.log(req.user);
      res.send({msg:req.user.email});
    }
  );
  app.post('/logOut',function(req,res){
    console.log("logOut");
    var q=  req.logout();
    res.end();
  })
  app.get('/auth/facebook',passport.authenticate('facebookAuth',{
    scope : 'email'
  }));
  app.get('/auth/facebook/callback',passport.authenticate('facebookAuth',{
      successRedirect : '/'
      ,failureRedirect : '/fail'
    }));
    app.get('/auth/google',passport.authenticate('googleAuth',{
      scope : 'email'
    }));
    app.get('/auth/google/callback',passport.authenticate('googleAuth',{
        successRedirect : '/'
        ,failureRedirect : '/fail'
      }));
    app.get('/auth/twitter',passport.authenticate('twitterAuth',{
      scope : 'email'
    }));
    app.get('/auth/twitter/callbakc',passport.authenticate('twitterAuth',{
        successRedirect : '/'
        ,failureRedirect : '/fail'
      }));

  app.get('/authSUCCESS',function(req,res){
    console.log("authSUCCESS %s ",req.user);
    console.dir(req.user);
  })
  app.put('/signup',passport.authenticate('local_signup',{
    failureFlash: true
  }),function(req,res){
    res.send({msg:req.user.email});
      }
    );
}
