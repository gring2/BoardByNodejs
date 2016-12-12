var threadController = require('../controller/threadController');

module.exports = function(app){
  app.get('/',function(req,res){
    res.redirect('/home/0');
  })

  app.get('/reNew/:no',function(req,res){
    var token =  req.params.no || 0;
    threadController.getThreadList(token,req.app.get('db'))
    .then(function(result){
      res.send({threads:result.users});
    });

  });
  app.get('/viewThread/:no',function(req,res){
    var token =  req.params.no
    var value ={}
    threadController.getThread(token,req.app.get('db'))
    .then(function(result){
      value['thread'] = result;
    return  threadController.getCommentList(req.app.get('db'),result._id);
    })
    .then(function(result){
      value['comList'] = result;
      res.send({result:value});
    })
    .catch(function(err){
      new Error(err);
    });
  });
  app.get('/writeForm',function(req,res){
    if(req.isAuthenticated()){
      res.end();
    }else{
      res.status(500).end();
    }
  });
  app.get('/getThreadList',function(req,res){
    var value = {};
      threadController.getThreadList(0,req.app.get('db'))
      .then(function(result){
        console.log("result "+ result);
        res.send({list:result.users,count:result.count});
      });

  });
  app.get('/home/:no',function(req,res){
    var token =  req.params.no || 0;
    console.log('token ' + token);
    var value = {};
    value.title = 'Borad Main';
      value['email'] = (req.user == undefined)? null : req.user.email;
      threadController.getThreadList(token*5,req.app.get('db'))
      .then(function(result){
        value['threads']= result;
        res.render('index.ejs',value);
      });

  });
};
