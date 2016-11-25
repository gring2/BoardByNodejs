var route_loader = {};
var config = require('../config/config');
route_loader.init=function(app){
  console.log('route_loader activated');
  return initRoutes(app);
}

function initRoutes(app){
  var infoLen = config.route_info.length;
  console.log('Number of  routing module setted %d', infoLen);

  for(var i = 0; i<infoLen; i ++){
    var curItem = config.route_info[i];

    var curModule = require(curItem.file);
    console.log('%s file s module read' , curItem.file);

    if (curItem.type == 'get') {
			app.get(curItem.path, curModule[curItem.method]);
		} else if (curItem.type == 'put') {
			app.put(curItem.path, curModule[curItem.method]);
		} else if(curItem.type=='delete'){
			app.delete(curItem.path, curModule[curItem.method]);
		}else{
			app.post(curItem.path, curModule[curItem.method]);
		}

    console.log('routing module [%s] is setted', curItem.method);
  }
}

module.exports = route_loader;
