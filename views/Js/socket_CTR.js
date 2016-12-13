function socketObj(){
  var socketOb={};
  socketOb.connection = function(){
    var option = {'forceNew' : true};
    var url = 'http://localhost:3333/';
    socket = io.connect(url,option);
    socket.on('connect',function(){
      console.log("connected");
      socket.on('newComment',function(msg){
        var scope=angular.element($('#container')).scope();
        scope.$apply(function(){
          scope.$root.comList.unshift(msg);
        });
      });
    });
    socketOb.socket = socket;
  };
  socketOb.interActing = function(cmd,value){
    socketOb.socket.emit(cmd,value)
  }
  return socketOb;
}
