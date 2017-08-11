/**
* MenuController
*/
'use strict';

app.controller('MenuController', function ($scope, $location, $http, $rootScope, $state, MenuService) {
	console.log("Menu Controller reporting for duty.");

	$scope.categories = MenuService.categoryItems;

	var countCategories = 0;
	var halfCategories = $scope.categories.length/2;

	$scope.chunkArr = function(array){
		countCategories += 1;
		if(array.length<11)
			return {"array":chunk(array,5),"count":countCategories};
		if(array.length>=11){
			return {"array":chunk(array,7),"count":countCategories};
		}
	}

	$scope.changeDirection= function(count){
		console.log(count);
		return count > halfCategories+1;
	}

	function chunk(arr, size) {
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}
});