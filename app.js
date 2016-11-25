var express = require('express')
    , routes = require('./routes/route_loader')
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
     ,main = require('./routes/viewRoute').main
     ,databse = require('./database/databaseSetup')
     ,json = require('jayson')

    ,methodOverride = require('method-override');

var app = express();
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
    cookie: { secure: true }
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
routes.init(app);
databse.init(app,config);

http.createServer(app).listen(app.get('port'), function(){
  console.log('port is 3333');
});
https.createServer(options,app).listen(config.https_port, function(){
  console.log('port is'+ config.https_port);
});
