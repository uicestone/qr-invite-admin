import angularChartJs from 'angular-chart.js';

angular.module('qr-invite.dashboard', ['chart.js']).controller('DashboardController', ['$scope', 'overview', 'newUsers', 'activeUsers', 'mpAccountEvents', 'messages', 'interactions', 'ugcs', /*'retention', */'socket', 'Dashboard', function($scope, overview, newUsers, activeUsers, mpAccountEvents, messages, interactions, ugcs, /*retention, */socket, Dashboard){

	$scope.overview = overview.data;
	$scope.newUsers = newUsers.data;
	$scope.activeUsers = activeUsers.data;
	$scope.mpAccountEvents = mpAccountEvents.data;
	$scope.messages = messages.data;
	$scope.interactions = interactions.data;
	$scope.ugcs = ugcs.data;
	// $scope.retention = retention.data;

	$scope.recent_logs = [];
	$scope.showingTable = false;
	$scope.showingChart = true;

	// $scope.showTable = function(showing = true){
	// 	$scope.showingTable = showing;
	// }

	// $scope.showChart = function(showing = true){
	// 	$scope.showingChart = showing;
	// }

	// socket.io && socket.emit('subscribe', 'dashboard');

	// socket.io && socket.on('message', function(data){

	// 	if(data.log.action === '发布内容' && ['article', 'insight', 'topic', 'event', 'audio', 'video', 'collage_theme', 'collage_template'].indexOf(data.log.post_type) > -1){
	// 		$scope.overview.pgc_count++;
	// 	}

	// 	if(data.log.action === '发布内容' && ['comment', 'discussion', 'question', 'answer', 'record', 'collage', 'image'].indexOf(data.log.post_type) > -1){
	// 		$scope.overview.ugc_count++;
	// 	}

	// 	if(data.log.action === '创建用户'){
	// 		$scope.overview.users_count++;
	// 	}

	// 	if(data.log.action === '订单支付'){
	// 		$scope.overview.paid_amount += +data.log.order_price;
	// 	}

	// 	$scope.recent_logs.unshift(data.log);

	// 	if($scope.recent_logs.length > 30){
	// 		$scope.recent_logs.pop();
	// 	}

	// 	$scope.$apply();
	// });

	// 用户交互统计
	// $scope.chartInteractionsSeries = ['点赞', '分享', '参与', '领取', 'UGC'];

	// $scope.chartInteractionsLabels = $scope.interactions.likes.map(item => item.date);

	// $scope.chartInteractionsData = [
	// 	$scope.interactions.likes.map(item => item.count),
	// 	$scope.interactions.shares.map(item => item.count),
	// 	$scope.interactions.attends.map(item => item.count),
	// 	$scope.interactions.pays.map(item => item.count),
	// 	$scope.interactions.ugcs.map(item => item.count),
	// ];
	// console.log('interactions', $scope.chartInteractionsData);

	// 用户UGC统计
	// $scope.chartUgcsSeries = ['打卡', '评论', '提问', '回答'];

	// $scope.chartUgcsLabels = $scope.ugcs.comment.map(item => item.date);

	// $scope.chartUgcsData = [
	// 	($scope.ugcs.record || []).map(item => item.count),
	// 	($scope.ugcs.comment || []).map(item => item.count),
	// 	($scope.ugcs.question || []).map(item => item.count),
	// 	($scope.ugcs.answer || []).map(item => item.count),
	// ];
	// console.log('ugcs', $scope.chartUgcsData);

	// 新用户统计
	// $scope.chartNewUsersSeries = ['所有新用户'];

	// $scope.chartNewUsersLabels = $scope.newUsers.users.map(item => item.date);

	// $scope.chartNewUsersData = [
	// 	($scope.newUsers.users || []).map(item => item.count)
	// ];

	// // 活跃用户统计
	// $scope.chartActiveUsersSeries = ['IP', '活跃用户', '昨日回访', '上周回访', '上月回访'];

	// $scope.chartActiveUsersLabels = $scope.activeUsers.map(item => item.date);

	// $scope.chartActiveUsersData = [
	// 	$scope.activeUsers.map(item => item.ip),
	// 	$scope.activeUsers.map(item => item.ac),
	// 	$scope.activeUsers.map(item => item.pd),
	// 	$scope.activeUsers.map(item => item.pw),
	// 	$scope.activeUsers.map(item => item.pm)
	// ];
	// console.log('active users', $scope.chartActiveUsersData);

	// 微信事件统计
	// $scope.chartMpAccountEventsSeries = ['关注', '取关', '扫码', '菜单点击', '模板消息'];

	// $scope.chartMpAccountEventsLabels = $scope.mpAccountEvents.subscribe.map(item => item.date);

	// $scope.chartMpAccountEventsData = [
	// 	($scope.mpAccountEvents.subscribe || []).map(item => item.count),
	// 	($scope.mpAccountEvents.unsubscribe || []).map(item => item.count),
	// 	($scope.mpAccountEvents.SCAN || []).map(item => item.count),
	// 	($scope.mpAccountEvents.VIEW || []).map(item => item.count),
	// 	($scope.mpAccountEvents.TEMPLATESENDJOBFINISH || []).map(item => item.count)
	// ];
	// console.log('mp account events', $scope.chartMpAccountEventsData);

	// // 消息统计
	// $scope.chartMessagesSeries = ['消息'];

	// $scope.chartMessagesLabels = $scope.messages.comment.map(item => item.date);

	// $scope.chartMessagesData = [
	// 	($scope.messages.question || []).map(item => item.count),
	// 	($scope.messages.answer || []).map(item => item.count),
	// 	// ($scope.messages.record || []).map(item => item.count),
	// 	($scope.messages.discussion || []).map(item => item.count),
	// 	($scope.messages.comment || []).map(item => item.count)
	// ];

	$scope.datasetOverride = [{ yAxisID: 'count' }];
	
	$scope.options = {
		scales: {
			yAxes: [
				{
					id: 'count',
					type: 'linear',
					display: true,
					position: 'left'
				}
			],
			xAxes: [
				{
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
							day: 'M/D'
						}
					}
				}
			]
		},
		legend: {
			display: true
		}
	};

}]);