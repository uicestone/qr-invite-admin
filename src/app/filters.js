let filters = angular.module('qr-invite.filters', [])

.filter('plain', function(){
	return function(input, args){
		
		if(args === undefined){
			args = {};
		}
		
		if(angular.isObject(input) && !angular.isArray(input)){
			var array = [];
			for(var key in input){
				array.push(key + ': ' + input[key]);
			}
			input = array;
		}
		
		if(angular.isArray(input)){
			input = input.join(', ');
		}
		
		var output = input;
		
		if(!output && (args.placeholder === undefined || args.placeholder)){
			output = '-';
		}
		
		return output;
	}
})
.filter('htmlToPlain', function(){
	return function(text){
	  return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};
})
.filter('lines', function(){
	return function(text){
		if(!text || typeof text !== 'string'){
			return 2;
		}
		return (text.match(/\n/g) ? text.match(/\n/g).length : 0) + 2;
	};
})
.filter('parseJson', function(){
	return function(string){
		var json;
		try{
			json = JSON.parse(string);
			return json;
		}catch(e){
			return string;
		}
	}
})
.filter('hasKey', function(){
	return function(object, key){
		if(typeof object !== 'object'){
			return false;
		}
		return object[key] !== undefined;
	}
})
.filter('get', function(){
	return function(object, key){
		if(typeof object !== 'object'){
			return;
		}
		return object[key];
	}
})
.filter('match', function(){
	return function(string, regexp){
		return string.match(new RegExp(regexp));
	}
})
.filter('in', function(){
	return function(value, array){
		return array.indexOf(value) > -1;
	}
})
.filter('notIn', function(){
	return function(value, array){
		return array.indexOf(value) === -1;
	}
});

// export default filters.name;