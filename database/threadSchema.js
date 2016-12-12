var bird = require('bluebird');
var threadSchema = {};
  threadSchema.createSchema=function(mongoose){
    var schema = mongoose.Schema({
      title:{type: String, default:'no title'}
      ,context:{type : String}
      ,created_at: {type: Date, index: {unique: false},'default':Date.now}
      ,updated_at: {type: Date, index: {unique: false},'default':Date.now}
      ,writer:{type : String, required: true}
      ,commentNum:{type: Number, default: '0'}
      ,Hits:{type: Number, default: '1'}

    });
    schema.static('getList',function(anchor,callback){
      var set={};
      var threadModel = this;
      threadModel.find({},{context:0}, function setting(err, thread){
           new bird(function(resolve,reject){
                resolve(thread);
            });
            }
      ).skip(anchor).limit(5).sort({_id:-1})
      .then(function(thread){
        threadModel.find({}).count(function(err, result){
          var who = thread;
          set['users'] = thread;
          set['count'] = result;
            callback(set);
        });
      });
    });
    schema.static('getThread',function(anchor){
      var model = this;
      return new bird(function(resolve, reject){

        model.findOneAndUpdate({_id:anchor}
            ,{$inc: {Hits:1}}
            ,{new : true}
            ,function(err,result){
              console.log(result);
              if(err) reject(err);
              else resolve(result);
            }
          );
        });

    });
    schema.static('incCommentNumber',function(number){
      var model = this
      new bird(function(resolve,reject){
        model.update({_id:number},{$inc:{commentNum:1}},function(err,result){
          console.log("udpate" + result);
            if(err) reject(err);
            else resolve(result);
        });
      });
    })
    return schema;
  }

module.exports=function(){ return {threadSchema:threadSchema}};
