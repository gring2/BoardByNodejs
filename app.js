var express = require('express')
    , http = require('http')
    , https = require('https')
    , path  = require('path')
    ,body_parser = require('body-parser')
    ,multer = require('multer')
    ,cookie_session = require('cookie-session')
    ,cookie_parser = require('cookie-parser')
    ,serveStatic = require('serve-static')
    ,express_session = require('express-session')
    ,favicon = require('serve-favicon')
    ,errorHandler = require('errorhandler')
    ,morgan = require('morgan')
    ,fs = require('fs')
     ,databse = require('./database/databaseSetup')
     ,json = require('jayson')
     ,passport = require('passport')
     ,socket_io = require('socket.io')
    ,methodOverride = require('method-override');
var cors = require('cors');
var app = express();
app.use(cors());

var config = require('./config/config');

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

app.set('session', express_session);
app.set('port',config.server_port||3333);
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs');
//middleWare
app.use('/views',serveStatic(path.join(__dirname,'/views')));
app.use('/semantic',serveStatic(path.join(__dirname,'/semantic')));
app.use(serveStatic(__dirname+'/views'));
app.use(body_parser.urlencoded({
  extended: true
}));
app.use(body_parser.json());
app.use(express_session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
//    cookie: { secure: true }
  }));

  /* POST 호출 처리 */
//errorhandler
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler());
}

//Log
var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(morgan('dev',{stream: accessLogStream}));

databse.init(app,config);

app.use(passport.initialize());

app.use(passport.session());

// app.get('/',function(req,res){
//   console.log(req.user);
//   res.render('index',{title:'Board'});
// });

var server  = http.createServer(app).listen(app.get('port'), function(){
  console.log('port is 3333');
});
https.createServer(options,app).listen(config.https_port, function(){
  console.log('port is'+ config.https_port);
});


//socket parts
var socketArry={};
var io = socket_io.listen(server);
console.log('Socket ready');
io.sockets.on('connection', function(socket){
  console.log('connection info : ',socket.request.connection._peername);
  if(socketArry[socket.id]==null) socketArry[socket.id]=[];

  //check whether user is in any socket room

  socket.on('room',function(msg){
    //room array
    var tempArray = socketArry[socket.id];
    //if belong to any room, out and join new room
    if(tempArray.length>0){
      socket.leave(tempArray[0]);
    }
      tempArray[0] = msg.id;
      socket.join(msg.id);
  });
  socket.on('disconnect',function(){
    console.log("disconnect");
  });
})

var passportSetup = require('./config/passport/passportSetup');
passportSetup(app,passport);
var passport_Router = require('./routes/passport_Router');
passport_Router(app,passport);
var view_Router = require('./routes/viewRoute');
view_Router(app);
var write_Router = require('./routes/writeRoute');
write_Router(app,io);
