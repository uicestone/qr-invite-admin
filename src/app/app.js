import angular from 'angular';
import ngRoute from 'angular-route';
import uiBootstap from 'angular-ui-bootstrap';
import services from './services';
import filters from './filters';
import directives from './directives';
import * as controllers from './controllers/';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../style/app.css';

let app = angular.module('qr-invite', [
	ngRoute,
	uiBootstap,
	'qr-invite.controllers',
	'qr-invite.services',
	'qr-invite.filters',
	'qr-invite.directives'
])
.config(['$routeProvider', '$httpProvider', '$locationProvider', '$sceDelegateProvider', function($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider) {
	$routeProvider
		.when('/login', {})
		.when('/user', {
			controller: 'UserController',
			templateUrl: 'template/user/list.html',
			resolve: {
				users: ['$route', 'User', function($route, User){
					return User.query(angular.extend({per_page: 20}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/user/:id', {
			controller: 'UserEditController',
			templateUrl: 'template/user/edit.html',
			resolve: {
				user: ['$route', 'User', function($route, User){
					if($route.current.params.id === 'new'){
						return new User();
					}
					return User.get({id: $route.current.params.id}).$promise;
				}]
			}
		})
		.when('/tag', {
			controller: 'TagController',
			templateUrl: 'template/tag/list.html',
			resolve: {
				tags: ['$route', 'Tag', function($route, Tag){
					return Tag.query(angular.extend({per_page: 20}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/tag/:id', {
			controller: 'TagEditController',
			templateUrl: 'template/tag/edit.html',
			resolve: {
				tag: ['$route', 'Tag', function($route, Tag){
					if($route.current.params.id === 'new'){
						return new Tag();
					}
					return Tag.get({id: $route.current.params.id}).$promise;
				}]
			}
		})
		.when('/post', {
			controller: 'PostController',
			templateUrl: 'template/post/list.html',
			resolve: {
				posts: ['$route', 'Post', function($route, Post){
					return Post.query(angular.extend({per_page: 20}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/post/:id', {
			controller: 'PostEditController',
			templateUrl: 'template/post/edit.html',
			resolve: {
				post: ['$route', 'Post', function($route, Post){
					if($route.current.params.id === 'new'){
						return new Post();
					}
					return Post.get($route.current.params).$promise;
				}]
			}
		})
		.when('/message', {
			controller: 'MessageController',
			templateUrl: 'template/message/list.html',
			resolve: {
				messages: ['$route', 'Message', function($route, Message){
					return Message.query(angular.extend({per_page: 20}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/order', {
			controller: 'OrderController',
			templateUrl: 'template/order/list.html',
			resolve: {
				orders: ['$route', 'Order', function($route, Order){
					return Order.query(angular.extend({per_page: 20}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/order/:id', {
			controller: 'OrderEditController',
			templateUrl: 'template/order/edit.html',
			resolve: {
				order: ['$route', 'Order', function($route, Order){
					if($route.current.params.id === 'new'){
						return new Order();
					}
					return Order.get({id: $route.current.params.id}).$promise;
				}]
			}
		})
		.when('/config', {
			controller: 'ConfigController',
			templateUrl: 'template/config/list.html',
			resolve: {
				configs: ['$route', 'Config', function($route, Config){
					return Config.query(angular.extend({per_page: 50}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/config/:id', {
			controller: 'ConfigEditController',
			templateUrl: 'template/config/edit.html',
			resolve: {
				config: ['$route', 'Config', function($route, Config){
					if($route.current.params.id === 'new'){
						return new Config();
					}
					return Config.get({id: $route.current.params.id, decode: false}).$promise;
				}]
			}
		})
		.when('/task', {
			controller: 'TaskController',
			templateUrl: 'template/task/list.html',
			resolve: {
				tasks: ['$route', 'Task', function($route, Task){
					return Task.query(angular.extend({per_page: 50}, $route.current.params)).$promise;
				}]
			}
		})
		.when('/task/:id', {
			controller: 'TaskEditController',
			templateUrl: 'template/task/edit.html',
			resolve: {
				task: ['$route', 'Task', function($route, Task){
					if($route.current.params.id === 'new'){
						return new Task();
					}
					return Task.get({id: $route.current.params.id}).$promise;
				}]
			}
		})
		.when('/dashboard', {
			controller: 'DashboardController',
			templateUrl: 'template/dashboard/overview.html',
			resolve: {
				overview: ['Dashboard', function(Dashboard){
					return Dashboard.getOverview();
				}],
				newUsers: ['Dashboard', function(Dashboard){
					return Dashboard.getNewUsers();
				}],
				activeUsers: ['Dashboard', function(Dashboard){
					return Dashboard.getActiveUsers();
				}],
				mpAccountEvents: ['Dashboard', function(Dashboard){
					return Dashboard.getMpAccountEvents();
				}],
				messages: ['Dashboard', function(Dashboard){
					return Dashboard.getMessages();
				}],
				interactions: ['Dashboard', function(Dashboard){
					return Dashboard.getInteractions();
				}],
				ugcs: ['Dashboard', function(Dashboard){
					return Dashboard.getUgcs();
				}]
				// retention: ['Dashboard', function(Dashboard){
				// 	return Dashboard.getRetention();
				// }],
			}
		})
		.otherwise({redirectTo: 'dashboard'});

	$httpProvider.interceptors.push('HttpInterceptor');
	
	$locationProvider.html5Mode(true);

	$sceDelegateProvider.resourceUrlWhitelist(['**']);

}])

.controller('AlertController', ['$scope', '$rootScope', 'Alert',
	function($scope, $rootScope, Alert){
		$scope.alerts = Alert.get();
		$scope.close = Alert.close;
		$scope.previous = function(){};
		$scope.next = function(){};
		
		$scope.toggleCloseButton = function(index){
			$scope.alerts[index].closeable = !$scope.alerts[index].closeable;
		};
	
		$rootScope.$on('$routeChangeSuccess', function(){
			Alert.clear();
		});
	}
])

.controller('NavController', ['$scope', '$location', '$rootScope', 'Auth',
	function($scope, $location, $rootScope, Auth){
		$scope.navIsCollapsed = true;

		$scope.user = Auth.user();

		$scope.logout = function(){
			localStorage.removeItem('token');
			$location.search({next:$location.url()}).path('login');
		}

		$scope.$watch('user', user => {
			// console.log($scope.inLogin, user);
			if(user.$resolved !== false && !user.id && $location.path() !== '/login') {
				// console.log('Not logged in, redirect to login');
				$location.search({next:$location.url()}).path('login');
			}
			else if(user.id && $location.path() === '/login') {
				// console.log('Already logged in, redirect to ' + ($location.search().next || '/'));
				$location.url($location.search().next || '/');
			}
		}, true);

		$rootScope.$on('$routeChangeSuccess', function(){
			$scope.wasInlogin = $scope.inLogin;
			$scope.inLogin = $location.path() === '/login';
		});
	}
])

.controller('LoginController', ['$scope', '$location', '$http', 'Alert', 'Auth',
	function($scope, $location, $http, Alert, Auth){
		$scope.login = function(){
			$scope.$parent.user = Auth.login($scope.username, $scope.password);
		}
	}
]);

export default app;