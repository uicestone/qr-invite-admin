import ngResource from 'angular-resource';
import io from 'socket.io-client';

let responseInterceptor = function(response){
	response.resource.$response = response;
	return response.resource;
};

let services = angular.module('qr-invite.services', ['ngResource'])

.service('Auth', ['$http', 'User', function($http, User){

	var user = new User();

	this.login = function(username, password) {
		return User.login({username: username, password: password}, user => {
			localStorage.setItem('token', user.token);
		});
	}

	this.user = function() {
		if(!localStorage.getItem('token')) {
			user.$resolved = true;
			return user;
		}

		return User.auth();
	}
}])

.service('User', ['$resource', function($resource){
	var user = $resource(apiBase + 'user/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'},
		auth: {method: 'GET', url: apiBase + 'auth/user'},
		login: {method: 'POST', url: apiBase + 'auth/login'}
	});
	
	user.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	user.prototype.can = function(ability) {
		if(!this.permissions) {
			return false;
		}
		return this.permissions.some(permission => ability.match(new RegExp(permission)));
	};

	return user;
}])

.service('Post', ['$resource', function($resource){

	var drafts = angular.fromJson(localStorage.getItem('postDrafts')) || {};

	var post = $resource(apiBase + 'post/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'},
		grant: {method: 'POST', url: apiBase + 'post/:id/paid-users', params: {'id': '@id'}}
	});

	post.prototype.$saveDraft = function(){
		if(this.id) {
			drafts[this.id] = this;
		}
		else {
			drafts.new = this;
		}

		localStorage.setItem('postDrafts', angular.toJson(drafts));
	};

	post.prototype.$getDraft = function(){
		if(this.id) {
			return drafts[this.id];
		}
		else {
			return drafts.new;
		}

		localStorage.setItem('postDrafts', angular.toJson(drafts));
	}

	post.prototype.$removeDraft = function(){
		if(this.id) {
			drafts[this.id] = null;
		}
		else {
			drafts.new = null;
		}

		localStorage.setItem('postDrafts', angular.toJson(drafts));
	}
	
	post.prototype.$save = function(a, b, c, d){
		if(this.id && !a.restore){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	return post;
}])

.service('Tag', ['$resource', function($resource){
	var tag = $resource(apiBase + 'tag/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'}
	});
	
	tag.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	return tag;
}])

.service('Message', ['$resource', function($resource){
	var message = $resource(apiBase + 'message/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'}
	});
	
	message.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}

	message.send = function(user, content, action, event){
		$http.post(apiBase + 'message?to=ios', {user_id:user.id, content:content, action:action, event:event});
	};

	return message;
}])

.service('Config', ['$resource', function($resource){
	var config = $resource(apiBase + 'config/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'}
	});
	
	config.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	return config;
}])

.service('Order', ['$resource', function($resource){
	var order = $resource(apiBase + 'order/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'}
	});

	order.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}

	return order;
}])

.service('Task', ['$resource', function($resource){
	var task = $resource(apiBase + 'task/:id', {id: '@id'}, {
		query: {method: 'GET', isArray: true, interceptor: {response: responseInterceptor}},
		create: {method: 'POST'},
		update: {method: 'PUT'}
	});
	
	task.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	return task;
}])

.service('Dashboard', ['$http', function($http){
	this.getOverview = function(){
		return $http.get(apiBase + 'dashboard/overview');
	}
	this.getInteractions = function(){
		return $http.get(apiBase + 'dashboard/interactions');
	}
	this.getUgcs = function(){
		return $http.get(apiBase + 'dashboard/ugcs');
	}
	this.getNewUsers = function(){
		return $http.get(apiBase + 'dashboard/new-users');
	}
	this.getActiveUsers = function(){
		return $http.get(apiBase + 'dashboard/active-users');
	}
	this.getMpAccountEvents = function(){
		return $http.get(apiBase + 'dashboard/mp-account-events');
	}
	this.getMessages = function(){
		return $http.get(apiBase + 'dashboard/messages');
	}
	this.getRetention = function(){
		return $http.get(apiBase + 'dashboard/retention');
	}
}])

.service('Wechat', ['$resource', function($resource){
	var wechat = $resource(apiBase + 'wx/:item/:account', {item: '@item'}, {
		get: {method: 'GET', params: {item: 'account'}},
		query: {method: 'GET', isArray: true, params: {item: 'account-list'}},
		getTemplates: {method: 'GET', isArray: true, params: {item: 'template-list'}}
	});
	
	wechat.prototype.$save = function(a, b, c, d){
		if(this.id){
			return this.$update(a, b, c, d);
		}
		else{
			return this.$create(a, b, c, d);
		}
	}
	
	return wechat;
}])

.service('socket', [function() {
	if(webSocketUrl) {
		var socket = new io(webSocketUrl);
		return socket;
	}
}])

.service('HttpInterceptor', ['$q', '$timeout', '$location', 'Alert', function($q, $timeout, $location, Alert) {
	
	return {
		request: function(config) {

			if(config && config.cache === undefined){
				
				config.alert = {normal: {}, slow: {}};

				config.alert.normal.timeout = $timeout(function(){
					config.alert.normal.id = Alert.add('正在加载...');
				}, 200);

				config.alert.slow.timeout = $timeout(function(){
					Alert.close(config.alert.normal.id);
					config.alert.slow.id = Alert.add('仍在继续...');
				}, 5000);
				
				config.headers['Xinxin-Request-From'] = 'admin';
				config.headers['Authorization'] = localStorage.getItem('token');
				
				return config;
			}
			
			return config || $q.when(config);
		},
		requestError: function(rejection) {
			return $q.reject(rejection);
		},
		response: function(response) {

			if(response && response.config.cache === undefined){
				$timeout.cancel(response.config.alert.normal.timeout);
				$timeout.cancel(response.config.alert.slow.timeout);
				Alert.close(response.config.alert.normal.id);
				Alert.close(response.config.alert.slow.id);
			}
			
			return response || $q.when(response);
		},
		responseError: function(rejection) {

			$timeout.cancel(rejection.config.alert.normal.timeout);
			$timeout.cancel(rejection.config.alert.slow.timeout);
			Alert.close(rejection.config.alert.normal.id);
			Alert.close(rejection.config.alert.slow.id);

			if(rejection.status === 401){
				localStorage.removeItem('token');
				$location.path('login');
			}

			if(rejection.data && rejection.data.message){
				Alert.add(rejection.data.message, 'danger', true);
			}
			else if(rejection.status > 0){
				Alert.add(rejection.statusText, 'danger', true);
			}
			else{
				Alert.add('网络错误', 'danger', true);
			}
			
			return $q.reject(rejection);
		}
	};
}])

.service('Alert', [function(){
	
	var items = [];
		
	this.get = function(){
		return items;
	},

	this.add = function(message, type, actions) {
		var id = new Date().getTime();
		for(var index in items){
			if (items[index].msg === message){
				items.splice(index, 1);
			}
		}
		items.push({id: id, msg: message, type: type === undefined ? 'warning' : type, actions: actions});
		return id;
	},

	this.close = function(id){
		if(id === undefined){
			return;
		}
		for(var index in items){
			if (items[index].id === id){
				break;
			}
		}
		items.splice(index, 1);
	}
	
	this.clear = function(){
		items.splice(0, items.length);
	}
	
}]);