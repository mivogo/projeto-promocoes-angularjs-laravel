/**
* 404 Controller
*/

'use strict';

app.controller('404Controller', function ($scope, $location, $http, $state) {
	//console.log("404 Controller reporting for duty.");

	$scope.home = function(){
		$state.go('home');
	};
});