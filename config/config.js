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
        schemaName:'localUserSchema',
        modelName:'localUserModel'}
  ]
  ,route_info : [
    {file:'../routes/viewRoute',type:'get',method:'main',path:'/main'}
    ,{file:'../routes/viewRoute',type:'get',method:'signupPage',path:'/singUpPage'}
    ,{file:'../routes/userRoute', type:'put',method:'signup',path:'/signup'}
    ,{file:'../routes/userRoute', type:'post',method:'signIn',path:'/signIn'}
    ,{file:'../routes/userRoute', type:'post',method:'logOut',path:'/logOut'}

  ]
}

module.exports = config;
