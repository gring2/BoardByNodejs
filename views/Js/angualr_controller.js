
myApp.controller('MainCTR' ,['setPagePanner','count','preLoads','$scope', 'Server','$routeParams','sharedProperties','$location'
,function (setPagePanner,count,preLoads,$scope, Server,$routeParams,sharedProperties,$location) {
	$scope.$root.count=count;
	$scope.$root.threads = preLoads;
	compareTime();
	$scope.$root.numberOfPannel = setPagePanner($scope.$root.count);
	console.log($scope.$root.numberOfPannel);
	$scope.user;
	$scope.OauthUser = function(value){
	$scope.user=value;
	if($scope.user){
			$scope.signIned = true;
			$scope.email = $scope.user;
	}
	};
	$scope.signIned = ($routeParams.logined=='true')? true:false;
	$scope.message;
	$scope.failLog= ($routeParams.logined=='true' )? true:false;;
	$scope.$root.nowPage = ($scope.$root.nowPage === undefined) ? 1: $scope.$root.nowPage;

	$scope.signIn=function(event){
		var email =	$('#userId').val();
		var pw =	$('#userPw').val();
		var json={};
		var url = '/signIn';
		json['email'] = email, json['pw'] = pw;
		Server.post(url,json)
		.success(function(data, status, header, config){
			$scope.email = data.msg;
			$scope.failLog=false;
			$scope.signIned = true;
	})
	.error(function(data, status, header, config){
		$scope.failLog=true;
	});
};

$scope.signInLogChange = function(event) {
		$scope.failLog=false;
	};
$scope.logOut = function(event){
		Server.post('/logOut')
		.success(function(data, status,header, config){
			$scope.email = null;
			$scope.failLog=false;
			$scope.signIned = false;
			$scope.$root.template = undefined;
		})
		.error(function(data,status,header,config){
		});
	};
$scope.changeToSignPage = function(event){
 			$location.path('/signUpPage/');
	};
$scope.backtoMain = function(event){
		 $location.path('/');
	};
$scope.facebookAuth = function () {
				window.location='/auth/facebook';
	};
$scope.twitterAuth = function(){
		window.location='/auth/twitter';
	};
$scope.googleAuth = function(){
		window.location='/auth/google';
	};
$scope.pageChange = function(num){
		console.log(num);
		$scope.$root.nowPage = num;
		pageMark($scope.$root.nowPage);
		threadListRenew($scope.$root.nowPage);

	}
$scope.prevPage = function(){
		if($scope.$root.nowPage==1){
			return;
		}
		if($scope.$root.nowPage%4==1){
					popAndPush($scope.$root.numberOfPannel,false);
					setTimeout(function(){
						pageMark(--$scope.$root.nowPage);
					},0);
		}else{
			$scope.$root.nowPage=($scope.$root.nowPage>1) ? $scope.$root.nowPage-1:1;

			pageMark($scope.$root.nowPage);
		}
		threadListRenew($scope.$root.nowPage);

	}
$scope.nextPage = function(){
		console.log($scope.$root.numberOfPannel);
		console.log($scope.$root.nowPage);
		var temp = $('#lastPage').text();
		if($scope.$root.nowPage==$scope.$root.numberOfPannel.length){
			return;
		}
		if(temp&&$scope.$root.nowPage%4==0){
			popAndPush($scope.$root.numberOfPannel,true);
		}else{
			$scope.$root.nowPage+=1;
			pageMark($scope.$root.nowPage);
		}
		threadListRenew($scope.$root.nowPage);
	};

$scope.compare = function(value,index){
		if(index==0) return true;
		return $scope.$root.numberOfPannel[index]>$scope.$root.numberOfPannel[0];
	};
$scope.openThread = function(id){
Server.get('/viewThread/'+id)
		.success(function(data){
			var thread = data.result.thread;
			var day = new Date()-new Date(thread.updated_at);
			var dayDiff = Math.ceil(day/86400000);
			thread.dayDiff = dayDiff;
			$scope.threadView = thread;
			sharedProperties.setProperty('nowIndex',id);
			$scope.threadViewer ='../template/viewForm.html';
			$scope.commentList = '../template/commentList.html'
			$scope.$root.comList=data.result.comList;
		})
		.error(function(error){
			console.log(error);
		})
	};
	$scope.close = function(){
		$scope.threadView = null;
		$scope.threadViewer=undefined; 	$scope.commentList = undefined;
	}
	//utill function
	function threadListRenew(listNo){
		Server.get('/reNew/'+listNo)
		.success(function(data){
			console.log(data);
			$scope.$root.threads = data.threads
			compareTime()
		})
		.error(function(error){
			console.log(error);

		})

	}

	function popAndPush(array, direct){
		if(direct==true){
			for(var i =0; i<4;i++){
				var temp = array.shift();
				array.push(temp);
			}
			$scope.$root.nowPage=array[0];
		}
		else{
			for(var i =0; i<4;i++){
				var temp = array.pop();
				array.splice(0,0,temp);
			}
		}
	}

	function pageMark(number){
		var pages = $('.pagePannel');
		var curidx= $scope.$root.numberOfPannel.indexOf(number);
		for(var idx=0; idx<pages.length;idx++){
				$(pages[idx]).css('background','#fff');
		}
			$(pages[curidx]).css('background','rgba(34,36,38,.1)');
	};


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
