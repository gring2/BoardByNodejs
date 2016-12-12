var myApp = angular.module("myApp", ['ngRoute','ngSanitize','preLoads']);
myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'../views/template/main.html',
		controller : 'writeCTR'
	})
	.when('/signUpPage/',{
		templateUrl:'../views/template/signUpPage.html',
		controller : 'signCTR'
	})
	.otherwise({
		redirectTo: '/'
	})
}]);
myApp.config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

myApp.factory('Server', ['$http', function ($http) {
	return {
		get: function(url) {
			return $http.get(url);
		},
		post: function(htpurl,json ) {
			return  $http({
					method: 'POST',
					url: htpurl,
					dataType: "json",
					data:JSON.stringify(json)
				})

		}
		,put: function(htpurl,json ) {
					return  $http({
							method: 'PUT',
							url: htpurl,
							dataType: "json",
							data:JSON.stringify(json)
						})

				}
	  };
	}]);

myApp.factory('setPagePanner',function(count){
	return function(count){
		var output = [];
		if(count<=5) {
			output.push(1);
		}
	else{
		var temp = count/5;
		for(var i =1; i<=temp; i++){
			output.push(i);
		}
		if(count%5 >0) output.push(output[output.length-1]+1);
	}
		// for(var i =1; i<=23; i++){
		// 	output.push(i);
		// }
		return output;
	}
})
myApp.service('sharedProperties', function () {
	    var property={};

	    return {
	        getProperty: function (key) {
	            return property[key];
	        },
	        setProperty: function(key,value) {
	            property[key] = value;
	        }
	    };
	});
