angular.module('qr-invite.users', ['ngFileUpload']).controller('UserController', ['$scope', '$location', 'users', 'Task', function($scope, $location, users, Task){
	$scope.users = users;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	var headers = $scope.users.$response.headers();
	$scope.itemsTotal = Number(headers['items-total']);
	$scope.itemsStart = Number(headers['items-start']);
	$scope.itemsEnd = Number(headers['items-end']);

	$scope.location = $location;

	$scope.search = function(keyword){
		keyword = keyword || null;
		$location.search('keyword', keyword);
	};
	
	$scope.queryArgs = $location.search();
	
	$scope.nextPage = function(){
		$location.search('page', ++$scope.currentPage);
	}

	$scope.previousPage = function(){
		$scope.currentPage--;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}
	
	$scope.editUser = function(user, $event){
		var url = 'user/' + user.id;
		
		if($event.ctrlKey || $event.metaKey) {
			$window.open(url);
		}
		else
		{
			$location.url(url);
		}
	}

	$scope.addListToTask = function(){
		Task.create({user_keyword:$scope.queryArgs.keyword}, function(task){
			$location.path('task/' + task.id);
		});
	}
}])
.controller('UserEditController', ['$scope', '$location', 'user', 'Alert', 'Upload', 'Message', function($scope, $location, user, Alert, Upload, Message){
	$scope.user = user;
	$scope.save = function(user){
		user.$save({}, function(){
			Alert.add('用户已保存', 'success');
			$location.replace().url('user/' + user.id);
		});
	};

	$scope.profile = {key:"", value:"", visibility:""};

	$scope.setProfile = function(key, value, visibility){
		if(!$scope.user.profiles){
			$scope.user.profiles = [];
		}

		var hasKey = false;

		$scope.user.profiles = $scope.user.profiles.map(function(profile){
			if(profile.key === key){
				hasKey = true;
				profile.value = value;
				profile.visibility = visibility;
			}
			return profile;
		});

		if(!hasKey){
			$scope.user.profiles.push({key: key, value: value, visibility: visibility});
		}
	};
	
	$scope.$watch('avatar', function(){
		$scope.upload($scope.avatar, function(user){
			$scope.user.avatar = user.avatar;
		});
	});
	
	$scope.upload = function (file, callback) {
		
		if(!file) return;
		
		Upload.upload({
			url: apiBase + 'user/' + $scope.user.id,
			data: {
				avatar: file,
				_method: 'put'
			}
		})
//		.progress(function (evt) {
//			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//			console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//		})
		.success(function (user, status, headers, config){
			Alert.add('上传成功', 'success');
			callback(user, status, headers, config);
		})
//		.error(function (data, status, headers, config) {
//			console.log('error status: ' + status);
//		})
	};
	
	$scope.setNewKey = function(key){
		$scope.newKey = key;
	}

	$scope.sendMessage = function(){
		Message.send($scope.user, $scope.messageContent, $scope.messageAction, $scope.messageEvent);
	}

}]);