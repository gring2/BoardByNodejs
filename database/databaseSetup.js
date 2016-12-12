
var db = {};
var mysql=null;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var promise = require('promise');
var autoinc = require('mongoose-auto-increment');

db.init=function(app,config){
  connect(app, config);
  // mysql = config.pool;
  // mysql.getConnection(function(err, conn){
  // 		if(err){
  // 			conn.release();
  // 			return;
  // 		}
  //
  // 		console.log('cageDate connection Thread id : ' +conn.threadId);
  //     	conn.release();
  //   });
};

function connect(app,config){
  console.log('mongodb connect() called');

  mongoose.Promise = global.Promise;
  var connection = mongoose.connect(config.db_url);
  db.mongodb = mongoose.connection;

  db.mongodb.on('error',console.error.bind(console, 'mongoose connection error.'));
  db.mongodb.on('open',function(){
    console.log('connected to mongodb');
    createSchema(app,config);
  })
  db.mongodb.on('disconnected',connect);
  autoinc.initialize(connection);
}

function createSchema(app,config){
   var schemaLen = config.db_schema.length;
   console.log('The numberof Schema : %d', schemaLen);
   config.db_schema.forEach(function(schema){
     var name = schema.schemaName
     console.dir(schema);
     var collection = schema.collection;
        var schemaSet = require(schema.file)();
        var curSchema=  schemaSet[name].createSchema(mongoose);
          if(name == 'threadSchema'){
            console.log("threadSchema plugin added");
            curSchema.plugin(autoinc.plugin,  {
                                                model: 'thread',
                                                startAt: 1,
                                                incrementBy: 1
                                              });
          }
          console.log('%s 모듈을 불러들인 후 스키마 정의함.', name);
          var curModel = mongoose.model(collection, curSchema);
          console.log('%s 컬렉션을 위해 모델 정의함.', collection);
          db[name] = curSchema;
          db[schema.modelName]=curModel;
          console.log('스키마 이름 [%s], 모델 이름 [%s] 이 database 객체의 속성으로 추가됨.', schema.schemaName, schema.modelName);

   })
   app.set('db',db);
}

module.exports=db;
