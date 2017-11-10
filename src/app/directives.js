let directives = angular.module('qr-invite.directives', [])

.directive('cipEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.cipEnter);
				});

				event.preventDefault();
			}
		});
	};
})
.directive('cipSelectOnEnter', ['$window', function ($window) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('keydown keypress', function (event) {
				if(event.which !== 13) {
					return;
				}
				
				if (!$window.getSelection().toString()) {
					// Required for mobile Safari
					this.setSelectionRange(0, this.value.length)
				}
			});
		}
	};
}])
.directive('cipEsc', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 27) {
				scope.$apply(function (){
					scope.$eval(attrs.cipEsc);
				});

				event.preventDefault();
			}
		});
	};
});
