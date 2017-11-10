angular.module('qr-invite.configs', []).controller('ConfigController', ['$scope', '$location', 'configs', function($scope, $location, configs){
	$scope.configs = configs;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	var headers = $scope.configs.$response.headers();
	$scope.itemsTotal = Number(headers['items-total']);
	$scope.itemsStart = Number(headers['items-start']);
	$scope.itemsEnd = Number(headers['items-end']);
	
	$scope.queryArgs = $location.search();
	
	$scope.search = function(keyword){
		keyword = keyword || null;
		$location.search('keyword', keyword);
	};
	
	$scope.nextPage = function(){
		$location.search('page', ++$scope.currentPage);
	}

	$scope.previousPage = function(){
		$scope.currentPage--;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}
	
	$scope.editConfig = function(config){
		$location.url('config/' + config.key);
	}
	
}])
.controller('ConfigEditController', ['$scope', '$location', 'config', 'Alert', function($scope, $location, config, Alert){
	$scope.config = config;
	
	$scope.save = function(config){
		config.$save({decode:false}, function(){
			Alert.add('配置已保存', 'success');
			$location.replace().url('config/' + config.key);
		});
	}
	
	$scope.generateWeixinQr = function(config){
		config.$save({generate_wx_qr:1}, function(){
			Alert.add('微信带参数二维码已生成', 'success');
			$location.replace().url('config/' + config.key);
		});
	}

	$scope.valueChange = function(){
		if($scope.config.value.match(/[[\{\}\[\]]/)){
			try {
				angular.fromJson($scope.config.value);
			}
			catch (e) {
				$scope.configForm.configValue.$error.json = true;
				return;
			}
		}

		delete $scope.configForm.configValue.$error.json;
	}
}]);