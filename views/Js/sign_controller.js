
myApp.controller('signCTR',function($scope,$routeParams,sharedProperties,Server){
	$scope.signUp = function(event){
		var json={};
		var url = '/signup';
		json['email']=$('#signId').val();
		json['pw']=$('#signPw').val();
		Server.put(url,json)
		.success(function(data,status,header,config){
			$scope.message = "Sign up Completed";
		})
		.error(function(data,status,header,config){
			$scope.message="중복 아이디"
		});
	};
	$scope.cancel=function(event){
		$('#signId').val('');
		$('#signPw').val('');
	};
	$scope.boardinit=function(){
		console.log(33434);
	}
});
