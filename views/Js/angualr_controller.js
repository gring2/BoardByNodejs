
myApp.controller('MainCTR', ['$scope', 'Server','sharedProperties' ,function ($scope, Server, sharedProperties) {
	$scope.message;
	$scope.signInLog=false;
	$scope.signIned = false;
	$scope.cancel=function(event){
		$('#signId').val('');
		$('#signPw').val('');

	}
	$scope.signIn=function(event){
	var email =	$('#userId').val();
	var pw =	$('#userPw').val();
	var json={};
	var url = '/signIn';
	json['email'] = email, json['pw'] = pw;
	Server.post(url,json)
	.success(function(data, status, header, config){
		console.log('success');
		$scope.email = data.email;
		console.log(data.email);
		console.log($scope.email);
		$scope.signInLog=false;
		$scope.signIned = true;
	})
	.error(function(data, status, header, config){
		console.log('error');
		console.log(status);
		console.log(data);
		$scope.signInLog=true;
	});
};
	$scope.signUp = function(event){
		var json={};
		var url = '/signup';
		json['email']=$('#signId').val();
		json['pw']=$('#signPw').val();
		Server.put(url,json)
		.success(function(data,status,header,config){
			$scope.message = data.msg;
			console.log($scope.message);
		})
	}

	$scope.signInLogChange = function(event) {
		$scope.signInLog=false;
	}

}]);
