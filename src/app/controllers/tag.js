angular.module('qr-invite.tags', []).controller('TagController', ['$scope', '$location', 'tags', function($scope, $location, tags){
	$scope.tags = tags;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	var headers = $scope.tags.$response.headers();
	$scope.itemsTotal = Number(headers['items-total']);
	$scope.itemsStart = Number(headers['items-start']);
	$scope.itemsEnd = Number(headers['items-end']);
	
	$scope.queryArgs = $location.search();

	$scope.nextPage = function(){
		$location.search('page', ++$scope.currentPage);
	}

	$scope.previousPage = function(){
		$scope.currentPage--;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}
	
	$scope.editTag = function(tag, $event){
		var url = 'tag/' + tag.id;
		
		if($event.ctrlKey || $event.metaKey) {
			$window.open(url);
		}
		else
		{
			$location.url(url);
		}
	}

	$scope.search = function(name){
		$location.search('keyword', name);
	}
	
}])
.controller('TagEditController', ['$scope', '$location', 'tag', 'Alert', function($scope, $location, tag, Alert){
	$scope.tag = tag;
	$scope.save = function(tag){
		tag.$save({}, function(){
			Alert.add('标签已保存', 'success');
			$location.replace().url('tag/' + tag.id);
		});
	}
}]);