angular.module('qr-invite.tasks', []).controller('TaskController', ['$scope', '$location', 'tasks', function($scope, $location, tasks){
	$scope.tasks = tasks;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	var headers = $scope.tasks.$response.headers();
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
	
	$scope.editTask = function(task, $event){
		var url = 'task/' + task.id;
		
		if($event.ctrlKey || $event.metaKey) {
			$window.open(url);
		}
		else
		{
			$location.url(url);
		}
	}
	
}])
.controller('TaskEditController', ['$scope', '$location', 'task', 'Alert', 'Wechat', function($scope, $location, task, Alert, Wechat){
	
	$scope.task = task;

	$scope.parseTemplateKeywords = function(template){
		if(!template || !template.content){
			return;
		}
		
		return template.content.match(/{{(.*?).DATA}}/g).map(result=>result.match(/{{(.*?).DATA}}/)[1]);
	};

	$scope.wechat = {accounts: Wechat.query()};
	
	// 微信号改变时更新模板消息列表
	$scope.$watch('task.data.mp_account', function(account){
		if($scope.task.type === '模板消息批量发送'){
			$scope.wechat.templates = Wechat.getTemplates({account});
		}
	});

	// 选择模板消息ID时找到对应的模板消息对象
	$scope.$watchGroup(['task.data.template_id', 'wechat.templates.$resolved'], function(values){
		
		let [template_id, templatesResolved] = values;

		if(!templatesResolved){
			return;
		}

		let matches = $scope.wechat.templates.filter(template => template.template_id === template_id);
		
		if(!matches){
			return;
		}

		$scope.task.data.template = matches[0];
	});

	$scope.save = function(task){
		task.$save(function(){
			Alert.add('任务已保存', 'success');
			$location.replace().url('task/' + task.id);
		});
	}	
}]);
