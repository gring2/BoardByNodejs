var myApp = angular.module("myApp", ['ngRoute','ngSanitize']);
myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/template/main.html',
		controller: 'MainCTR'
	})
	.when('/signUpPage',{
		templateUrl:'views/template/signUpPage.html',
		controller:'MainCTR'
	})
	.otherwise({
		redirectTo: '/'
	});
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

	    },
			put: function(htpurl,json ) {
				return  $http({
						method: 'PUT',
						url: htpurl,
						dataType: "json",
						data:JSON.stringify(json)
					})

			},
	  };
	}]);
myApp.service('sharedProperties', function () {
    var property;

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        }
    };
});
