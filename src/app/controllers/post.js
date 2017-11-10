import ngFileUpload from 'ng-file-upload';
import textAngularSanitize from 'textangular/dist/textAngular-sanitize.min';
import textAngular from 'textangular';
import 'textangular/dist/textAngular.css';

angular.module('qr-invite.posts', ['ngFileUpload', 'textAngular']).controller('PostController', ['$scope', '$location', '$route', '$window', 'User', 'Tag', 'posts', function($scope, $location, $route, $window, User, Tag, posts){
	var headers;

	$scope.posts = posts;
	$scope.currentPage = $location.search().page || 1;
	
	// get pagination argument from headers
	headers = $scope.posts.$response.headers();
	$scope.itemsTotal = Number(headers['items-total']);
	$scope.itemsStart = Number(headers['items-start']);
	$scope.itemsEnd = Number(headers['items-end']);

	$scope.location = $location;

	$scope.filterTag = function(tag, $event){

		var queryTags;

		if(tag.name){
			tag = tag.name;
		}

		if($event) {
			$event.stopPropagation();
		}

		if($scope.queryTags){
			$scope.queryTags.push(tag);
			queryTags = $scope.queryTags.join();
		}
		else{
			queryTags = tag;
		}
		$location.search('tag', queryTags);
	}
	
	$scope.clearTag = function(tagToRemove){
		$scope.queryTags = $scope.queryTags.filter(function(tag){ return tag !== tagToRemove; });
		$location.search('tag', $scope.queryTags.join() || null);
	}
	
	$scope.queryArgs = $location.search();
	
	if($scope.queryArgs.tag && !angular.isArray($scope.queryArgs.tag)){
		$scope.queryTags = $scope.queryArgs.tag.split(',');
	}

	$scope.searchUser = function(name){
		return User.query({keyword: name}).$promise;
	};

	$scope.searchTag = function(name){
		$scope.tagSearchIsOpen = true;
		return Tag.query({keyword: name, order_by: 'posts'}).$promise;
	};

	$scope.orderBy = $scope.queryArgs.order_by;
	$scope.order = $scope.queryArgs.order;
	
	$scope.hoveredField = null;
	$scope.hoverField = function(orderBy){
		$scope.hoveredField = orderBy;
	}
	
	$scope.setOrder = function(orderBy, defaultDirection){
		
		if(defaultDirection === undefined){
			defaultDirection === 'asc';
		}
		
		var direction;
		
		if($scope.orderBy !== orderBy){
			direction = defaultDirection;
		}
		else if($scope.order){
			direction = $scope.order === 'asc' ? 'desc' : 'asc';
		}
		else{
			direction = defaultDirection === 'asc' ? 'desc' : 'asc';
		}
		
		$location.search('order', direction);
		$location.search('order_by', orderBy);
	}
	
	$scope.toggleSelected = function(){
		if($scope.queryArgs.order === 'selected'){
			$location.search('order', null);
		}else{
			$location.search('order_by', null).search('order', 'selected');
		}
	}
	
	$scope.toggleFake = function(){
		if($scope.queryArgs.user_is_fake !== undefined){
			$location.search('user_is_fake', null);
		}else{
			$location.search('user_is_fake', 0);
		}
	}
	
	$scope.toggleReplied = function(){
		if($scope.queryArgs.replied !== undefined){
			$location.search('replied', null);
		}else{
			$location.search('replied', 0);
		}
	}
	
	$scope.togglePublished = function(){
		if($scope.queryArgs.published !== false){
			$location.search('published', false);
		}else{
			$location.search('published', null);
		}
	}

	$scope.showContentDetail = false;

	$scope.toggleContentDetail = function(){
		$scope.showContentDetail = !$scope.showContentDetail;
	}
	
	$scope.nextPage = function(){
		$location.search('page', ++$scope.currentPage);
	}

	$scope.previousPage = function(){
		$scope.currentPage--;
		$location.search('page', $scope.currentPage === 1 ? null : $scope.currentPage);
	}
	
	$scope.editPost = function(post, $event){

		var url = 'post/' + post.id;

		if($scope.queryArgs.trashed){
			url += '?include_trashed=1'
		}

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
	
	$scope.restore = function(post, $event){
		$event.stopPropagation();
		post.$save({restore:true}, function(){
			$scope.refresh();
		});
	}
	
	$scope.destroy = function(post, $event){
		$event.stopPropagation();
		post.$remove({force:1}, function(){
			$location.replace().url('post?trashed=1');
			$scope.refresh();
		});
	}
	
}])
.config(['$provide', function($provide){
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
		taOptions.toolbar = [
			['h2', 'h3', 'p'],
 			['ol', 'ul', 'quote', 'footer'],
			['bold', 'italics', 'underline', 'colorRed', 'colorBlue', 'colorGreen'],
 		    ['insertLink', 'html', 'stripEmptyLines']
		];
		taRegisterTool('stripEmptyLines', {
			// buttontext: '移除空行',
			iconclass: 'fa fa-eraser',
			action: function() {
				this.$editor().$parent.post.content = this.$editor().$parent.post.content.replace(/<p><br\/?><\/p>/g, '');
			}
		});
		taRegisterTool('colorRed', {
			iconclass: "fa fa-square cip-red",
			action: function() {
				this.$editor().wrapSelection('forecolor', '#E2465A');
			}
		});
		taRegisterTool('colorBlue', {
			iconclass: "fa fa-square cip-blue",
			action: function() {
				this.$editor().wrapSelection('forecolor', '#3382BC');
			}
		});
		taRegisterTool('colorGreen', {
			iconclass: "fa fa-square cip-green",
			action: function() {
				this.$editor().wrapSelection('forecolor', '#27bfbf');
			}
		});
		taRegisterTool('footer', {
			iconclass: "fa fa-copyright",
			action: function() {
				this.$editor().wrapSelection('formatBlock', '<footer>');
			}
		});

		return taOptions;
	}]);
}])
.controller('PostEditController', ['$scope', '$location', '$window', 'post', 'Alert', 'User', 'Post', 'Tag', 'Upload', function($scope, $location, $window, post, Alert, User, Post, Tag, Upload){
	$scope.post = post;

	$scope.children = Post.query({parent_id:post.id || false});
	
	$scope.save = function(post){
		post.$save({}, function(post){
			Alert.add('文章已保存' , 'success');
			$scope.removeDraft($scope.post);
			$location.replace().url('post/' + post.id);
		});
	};
	
	$scope.search = $location.search();
	
	if($scope.search.parent_id && !post.parent_id && !post.parent){
		post.parent_id = $scope.search.parent_id;
	}
	
	if($scope.search.type){
		$scope.post.type = $scope.search.type;
	}
	
	$scope.searchPost = function(name){
		return Post.query({keyword: name}).$promise;
	};
	
	$scope.searchUser = function(name){
		return User.query({keyword: name}).$promise;
	};

	$scope.isSearchingForTag = false;

	$scope.searchTag = function(name){
		$scope.tagSearchIsOpen = true;
		return Tag.query({keyword: name, order_by: 'posts'}).$promise;
	};
	
	$scope.addTag = function(tagName, isHidden, triggerFromEnter){

		if(triggerFromEnter && $scope.tagSearchIsOpen){
			return;
		}

		if(!$scope.post.tags){
			$scope.post.tags = [];
		}
		
		var duplicate = $scope.post.tags.filter(function(tag){
			return tag.name === tagName;
		});
		
		if(duplicate.length){
			return;
		}
		
		var tag = {name: tagName, is_hidden: isHidden};
		$scope.post.tags.push(tag);
		$scope.newTag = undefined;
	};

	$scope.addRelatedPost = function(){
		if(!$scope.post.related_posts){
			$scope.post.related_posts = [];
		}
		$scope.post.related_posts.push($scope.newRelative);
		$scope.syncRelatedPostsToMeta();
		$scope.newRelative = null;
	}

	$scope.moveUpRelatedPost = function(post){
		for(var i in $scope.post.related_posts){
			if(i > 0 && $scope.post.related_posts[i].id === post.id){
				var thisPost = $scope.post.related_posts[i];
				$scope.post.related_posts[i] = $scope.post.related_posts[i - 1];
				$scope.post.related_posts[i - 1] = thisPost;
			}
		}
		$scope.syncRelatedPostsToMeta();
	}

	$scope.removeRelatedPost = function(post){
		$scope.post.related_posts = $scope.post.related_posts.filter(function(relative){
			return relative.id !== post.id;
		});
		$scope.syncRelatedPostsToMeta();
	}

	$scope.syncRelatedPostsToMeta = function(){
		if(!$scope.post.related_posts){
			return;
		}
		var relatedPostIds = $scope.post.related_posts.map(function(post){
			return post.id;
		});
		$scope.setMeta('related_posts', relatedPostIds);
	}

	$scope.tagSearchIsOpen = false;

	$scope.selectTag = function(){
		$scope.tagSearchIsOpen = false;
	}

	$scope.toggleTagHidden = function(tag){
		tag.is_hidden = !tag.is_hidden;
	};

	$scope.$watch('noSearchResultsForTag', function(value){
		if(value){
			$scope.tagSearchIsOpen = false;
		}
	});

	$scope.removeTag = function(tagToRemove){
		$scope.post.tags = $scope.post.tags.filter(function(tag){
			return tag.name !== tagToRemove.name;
		});
	}
	
	$scope.remove = function(post){
		post.$remove({}, function(){
			history.back();
		});
	}

	$scope.$watch('poster', function(){
		$scope.upload($scope.poster, {type: 'image'}, function(post){
			$scope.post.poster = post;
		});
	})
	
	$scope.upload = function (file, fields, callback) {
		
		if(!file) return;
		
		Upload.upload({
			url: apiBase + 'post',
			file: file,
			fileFormDataName: 'file',
			fields: fields
		})
//		.progress(function (evt) {
//			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//			console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//		})
		.success(function (file, status, headers, config){
			Alert.add('上传成功', 'success');
			callback(file, status, headers, config);
		})
//		.error(function (data, status, headers, config) {
//			console.log('error status: ' + status);
//		})
	};

	$scope.uploadFileInContent = function(file, insertAction){

		$scope.upload(file, {type:'image'}, function(filePost){
			insertAction('insertImage', filePost.url);
		});

		return true;
	}
	
	$scope.setNewKey = function(key){
		$scope.newKey = key;
	}
	
	$scope.setMeta = function(key, value){
		if(!$scope.post.metas){
			$scope.post.metas = [];
		}
		
		var hasKey = false;
		
		$scope.post.metas = $scope.post.metas.map(function(meta){
			if(meta.key === key){
				hasKey = true;
				meta.value = value;
			}
			return meta;
		});
		
		if(!hasKey){
			$scope.post.metas.push({key: key, value: value});
		}
	};

	$scope.$watchCollection('post', function(newValue, oldValue){
		// 首次载入
		if(oldValue.__proto__.constructor.name !== 'Object'){
			if($scope.post.$getDraft() && !angular.equals($scope.post.$getDraft(), $scope.post)) {
				Alert.add('有未保存的更改', 'warning', [{label:'恢复', action: $scope.restoreDraft}, {label:'舍弃', action: $scope.removeDraft}]);
			}
		}
		// 更新
		else if(oldValue.__proto__.constructor.name === 'Object' && newValue.__proto__.constructor.name !== 'Object') {
			$scope.post.$saveDraft();
		}
	});

	$scope.restoreDraft = function(post) {
		$scope.post = new Post($scope.post.$getDraft());
	};

	$scope.removeDraft = function(post) {
		$scope.post.$removeDraft();
	};

	$scope.grant = function() {

		const membership_period = prompt('授权给此时间之前的有效会员');

		if(membership_period) {
			Post.grant({id: $scope.post.id}, {membership_period});
		}
	}

	$scope.granted = function() {
		return $scope.post.metas.some(meta => meta.key === 'membership_period');
	}

	$scope.editPost = function(post, $event){

		var url = 'post/' + post.id;

		if($event.ctrlKey || $event.metaKey) {
			$window.open(url);
		}
		else
		{
			$location.url(url);
		}
	}
}]);
