/**
* MenuController
*/
'use strict';

app.controller('MenuController', function ($scope, $location, $http, $rootScope, $state, MenuService, SearchService, FilterbarService) {
	//console.log("Menu Controller reporting for duty.");

	$scope.categories = MenuService.categoriesList();

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
		return count > halfCategories+1;
	}

	function chunk(arr, size) {
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}

	$scope.searchProducts = function(catName,subName){
		SearchService.setSearch('');
		FilterbarService.setCategory({name: catName, checked:true});
		MenuService.setSubcategory(subName);

		var sub = subName.toLowerCase();
		sub = sub.replace(/ /g, '-'); 
		var cat = catName.toLowerCase();
		cat = cat.replace(/ /g, '-'); 

		$state.go('search', {q: null, brand:null, category:null,menuCategory: cat, menuSubcategory: sub}, {reload: true});
	}
});