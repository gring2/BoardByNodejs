
myApp.controller('MainCTR' ,['$window','setPagePanner','count','preLoads','$scope', 'Server','$routeParams','sharedProperties','$location'
,function ($window,setPagePanner,count,preLoads,$scope, Server,$routeParams,sharedProperties,$location) {
	//readed comment map
	var readed = {};

	var socket = $window.socket;
	$scope.$root.comList;

	socket.connection();

	//number Of pageSet
	$scope.$root.count=count;

	//Threads now on
	$scope.$root.threads = preLoads;
	compareTime();

	$scope.$root.numberOfPannel = setPagePanner($scope.$root.count);

	// show Email address to view
	$scope.OauthUser = function(value){
	if(value){
			$scope.signIned = true;
			$scope.email = value;
	}
	};
	//where now on Signin
	$scope.signIned = false;

	// message when signUp finished
	$scope.message;

	//trigger for signIn fail message
	$scope.failLog= false;

	//thread number which now read
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
//filter for block that Pannel goes back to first
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
			$scope.commentList = '../template/commentList.html';
			$scope.$root.comList=data.result.comList;
			$scope.$root.comList[0].newest=true;
			socket.interActing('room',{id:id});
			if(readed[id]===null||readed[id]===undefined){
				readed[id]=[];
			}else{
				for(var number in readed[id]){
					$scope.$root.comList[number].newest=false;
				}
			}
		})
		.error(function(error){
			console.log(error);
		})
	};

	//close view Page
	$scope.close = function(){
		$scope.threadView = null;
		$scope.threadViewer=undefined; 	$scope.commentList = undefined;
	}
	//hide first comment ribbon
	$scope.hide=function(index){
		$('#label').hide();
		$scope.$root.comList[index].newest=false;
		var idx=sharedProperties.getProperty('nowIndex');
		readed[idx].push(index);
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

	//shift pannel array
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

	//mark number of now list
	function pageMark(number){
		var pages = $('.pagePannel');
		var curidx= $scope.$root.numberOfPannel.indexOf(number);
		for(var idx=0; idx<pages.length;idx++){
				$(pages[idx]).css('background','#fff');
		}
			$(pages[curidx]).css('background','rgba(34,36,38,.1)');
	};

	//compare thread's time with localtime
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
