var bird = require('bluebird');
var threadModel;
var commentModel;
var addThread = function(autoinc,database,thread){
  threadModel = database.threadModel;
  return new bird(function(resolve, reject){
    var threadInstance = new threadModel();
    threadInstance.title = thread.title;
    threadInstance.context = thread.context;
    threadInstance.writer = thread.writer;
    threadInstance.save(function(err){
      if(err) reject(err);
      resolve(threadInstance);
    })
    .catch(function(err){
        new Error(err);
    });
  });
};

var getThreadList = function(anchor,database){
    var pageList = (anchor===0)?0:Math.abs((anchor-1)*5);
    threadModel = database.threadModel;
    return new bird(function(resolve,reject){
      threadModel.getList(pageList,function(q){
          resolve(q)
      });
    })
  .catch(function(err){
    new Error(err);
  })
};
var getThread = function(anchor, database){
  threadModel = database.threadModel;

   return threadModel.getThread(anchor);

}
var writeComment = function(database,comment,number,commentor){
  commentModel = database.commentModel;
    var commentInstance = new commentModel({tNumber:number, comment:comment,commentor:commentor});
    return commentInstance.addComment()
    .then(function(result){
      database.threadModel.incCommentNumber(number);
    })
    .then(function(err,result){
      return  new bird(function(resolve,reject){
        if(err) reject(err);
        else resolve(result);
      })
    })
//    return  commentInstance.addComment();
}

var getCommentList = function(database, number){
  commentModel = database.commentModel;
  return commentModel.getCommentList(number);
};
module.exports.getCommentList = getCommentList;
module.exports.writeComment = writeComment;
module.exports.getThread = getThread;
module.exports.getThreadList=getThreadList;
module.exports.addThread = addThread;
