angular.module('qr-invite.orders', []).controller('OrderController', ['$scope', '$location', '$route', 'orders', 'User', 'Post', function($scope, $location, $route, orders, User, Post){
	$scope.orders = orders;
	$scope.currentPage = $location.search().page || 1;

	// get pagination argument from headers
	var headers = $scope.orders.$response.headers();
	$scope.itemsTotal = Number(headers['items-total']);
	$scope.itemsStart = Number(headers['items-start']);
	$scope.itemsEnd = Number(headers['items-end']);
	$scope.priceSum = Number(headers['price-sum']);
	
	$scope.queryArgs = $location.search();
	console.log($location.search());
	$scope.nextPage = function(){
		$location.search('page', ++$scope.currentPage);
	}

	$scope.previousPage = function(){
		$scope.currentPage--;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}

	$scope.editOrder = function(order, $event){
		var url = 'order/' + order.id;
		
		if($event.ctrlKey || $event.metaKey) {
			$window.open(url);
		}
		else
		{
			$location.url(url);
		}
	}

	$scope.refresh = function(){
		$route.reload();
	}
	
	$scope.addToWeixinGroup = function(order){
		var previousStatus = order.status;
		
		order.status = 'in_group';
		order.$save().then(function(){}, function(){
			order.status = previousStatus;
		});
	}
	
	$scope.searchUser = function(name){
		return User.query({keyword: name}).$promise;
	};

	$scope.searchPost = function(name){
		return Post.query({keyword: name, premium: true, published: 'any'}).$promise;
	};
	
	$scope.location = $location;
}])
.controller('OrderEditController', ['$scope', '$location', 'order', 'Alert', function($scope, $location, order, Alert){
	$scope.order = order;

	$scope.save = function(order){
		order.$save(function(){
			Alert.add('订单已保存', 'success');
			$location.replace().url('order/' + order.id);
			$scope.editingAttributes = {};
		});
	};

	$scope.editingAttributes = {};

	$scope.isEditing = function(attribute) {
		return $scope.editingAttributes[attribute];
	};

	$scope.setEditing = function(attribute) {
		$scope.editingAttributes[attribute] = true;
	};
}]);
