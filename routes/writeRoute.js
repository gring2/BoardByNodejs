var threadController = require('../controller/threadController');
var bird = require('bluebird');
module.exports = function(app,socketInstance){
  app.post('/saveWriting',function(req,res){
    if(req.isAuthenticated()){

    }else{
      res.status(500).send({message: 'signIn_First'});
    }
    var thread = req.body;
    var db = req.app.get('db');
    var autoinc = req.app.get('autoinc');
    thread["writer"] = req.user.email;
    threadController.addThread(autoinc,db,thread)
    .then(function(threadInstance){
      res.end();
    });
  });



  app.put('/writeComment',function(req,res){
    if(!req.isAuthenticated()){
      res.status(500).send().end();
    }else{
      var comment = req.body.comment;
      var number = req.body.nowIndex;
      var commentor = req.user.email;
      //write comment into db
      threadController.writeComment(req.app.get('db'),comment,number,commentor)
      .then(function(comment){
          // update commnetlist
          return threadController.getCommentList(req.app.get('db'),number);
      })
      .then(function(result){
        //broadcat to socketroom
        socketInstance.to(number).
        .emit("newComment" ,result[0]);
        res.send({comList:result});
      })
      .catch(function(err){
        new Error(err);
      });

    }
  });
}
