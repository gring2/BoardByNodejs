var bird = require('bluebird');
var commentSchema = {};
commentSchema.createSchema = function(mongoose){
  var schema = mongoose.Schema({
      tNumber : {type:Number, require: true, index: {unique: false}}
    , comment : {type: String }
    , updated_at : {type: Date, default : Date.now, require: true}
    , commentor :{type: String}
  })
  schema.method('addComment',function(){
    var commnetInstance = this
    return new bird(
      function(resolve,reject){
        commnetInstance.save(function(err, result){
          console.log(result);
          if(err) reject(err);
          else resolve(result);
        });
      }

    );
  });
  schema.static('getCommentList',function(number){
    var model = this;
    return  new bird(function(resolve,reject){
      model.find({tNumber:number},function(err, result){
        if(err) reject(err);
        else resolve(result);
      }).sort({updated_at:-1});

    })
  })

  return schema;

}
module.exports=function(){ return {commentSchema:commentSchema}};
