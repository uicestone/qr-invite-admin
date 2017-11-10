angular.module('qr-invite.messages', []).controller('MessageController', ['$scope', '$location', 'messages', function($scope, $location, messages){
	$scope.messages = messages;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	var headers = $scope.messages.$response.headers();
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
		$scope.currentPage --;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}
	
	$scope.editMessage = function(message, $event){
		var url = 'message/' + message.id;
		// if($event.ctrlKey || $event.metaKey) {
		// 	$window.open(url);
		// }
		// else
		// {
		// 	$location.url(url);
		// }
	}
}]);