var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10
  , host : 'localhost'
  , user : 'root'
  , password : 'gring2'
  , debug : false
});
var config = {
  server_port : 3333
  ,https_port :3334
  ,pool  :pool
  , db_url : 'mongodb://localhost:27017/board'
  , db_schema:[
    {file:'../database/userSchema',collection:'user',
      schemaName:'UserSchema',
      modelName:'UserModel'}
    ,{file:'../database/threadSchema',collection:'thread',
      schemaName:'threadSchema'
      ,modelName:"threadModel"}
      ,{file:'../database/commentSchema',collection:'comment',
        schemaName:'commentSchema'
        ,modelName:"commentModel"}

  ]
  ,facebook :{
    clientID : '409824489407766'
    ,clientSecret : '34083e2ef06f4089b8255d243454fc0e'
    ,callbackURL : '/auth/facebook/callback'
  }
  ,twitter:{
    clientID : 'bSdz9V1TI4OrzGwK9g2QdNvop'
    ,clientSecret : 'TGXK8udt4U2HI2S1QomdzSIJkFec112rf9ugjt3iVyKkoSaVNV'
    ,callbackURL : '/auth/twitter/callbakc'
  }
  ,google:{
    clientID : '247171446209-dd0hmbr1go0fisq9bu08ed2fj2fkl028.apps.googleusercontent.com'
    ,clientSecret : '5yuegU1CfaHnwf7H4OjVLiZi'
    ,callbackURL : '/auth/google/callback'
  }

}

module.exports = config;
