/**
* Filter Controller
*/
'use strict';

app.controller('FilterController', function ($scope, $location, $http, $rootScope,FilterbarService) {
	console.log("Filter Controller reporting for duty.");

	$scope.filterbarItemService = FilterbarService;
});