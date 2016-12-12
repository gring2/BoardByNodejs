myApp.controller('writeCTR',
['setPagePanner','$scope', 'Server','$routeParams','sharedProperties','$location'
,function(setPagePanner,$scope, Server,$routeParams,sharedProperties,$location){
	$location.hash('scroll');
	$scope.goWriteForm = function(){
		Server.get('/writeForm')
		.success(function(status,data){
		$scope.$root.template  =	($scope.$root.template  === undefined)? '../template/writeForm.html' : undefined;
		})
		.error(function(){
			$('.ui.basic.modal').modal('show');
		})
	}
	$scope.writeCancel = function(){
		$('#context').val('');
		$('#title').val('');
		$scope.$root.template =undefined;
	}
	$scope.save = function(){
		var json ={};
		json['title'] = $('#title').val();
		json['context'] = $('#context').val();
		var url = "/saveWriting"
		Server.post(url,json)
		.success(function(data,status,header,config){
      Server.get("/getThreadList")
      .success(function(data){
        console.log(data);
        $scope.$root.threads　= data.list;
				console.log($scope.threads);
        $scope.$root.count=data.count;
        $scope.$root.numberOfPannel= setPagePanner($scope.$root.count)
        $scope.$root.nowPage=1;
        compareTime()
				$scope.$root.template =undefined;
      })
		})
		.error(function(data,status,header,config){
			$('.ui.basic.modal').modal('show');

		});
	}
	$scope.writeComment=function(){
		var nowIndex = sharedProperties.getProperty('nowIndex');
		var comment = $('#writeComment').val();
		Server.put('/writeComment',{comment: comment,nowIndex:nowIndex})
		.success(function(data){
				$scope.$root.comList = data.comList;
				 $('#writeComment').val('');
		})
		.error(function(err){
			$('.ui.basic.modal').modal('show');

		});
	}
  function compareTime(){
    var now = new Date();
      now= now.getFullYear()+ now.getMonth()+ now.getDate();
      $scope.$root.threads.forEach(function (single){
      var singleThread = new Date(single.updated_at);
      var temp = singleThread.getFullYear() + singleThread.getMonth()+singleThread.getDate();
      single.isNew = (temp >= now) ? true : false;
    });
  }
}]);
