/**
* Filter Controller
*/
'use strict';

app.controller('FilterController', function ($scope, $location, $state, $http, $rootScope, FilterbarService) {
	console.log("Filter Controller reporting for duty.");

	$scope.brands = FilterbarService.brandListItems;
	$scope.categories = FilterbarService.categoryListItems;
	$scope.retailers = FilterbarService.retailerListItems;
	$scope.retailer = {}; 
	$scope.retailer.selected = FilterbarService.retailer;

	$scope.updateCategory = function(category, position, entitie, state){
		if(state){
			FilterbarService.setCategory(category);
			updateSelection(position,entitie);
		}
		if(!state){
			FilterbarService.setCategory('');
		}

		broadcastSearchPageReset();
	}

	$scope.updateBrand = function(brand, position, entitie, state){
		if(state){
			FilterbarService.setBrand(brand);
			updateSelection(position,entitie);
		}
		if(!state){
			FilterbarService.setBrand('');
		}

		broadcastSearchPageReset();
	}

	$scope.retailerChanged = function(){
		FilterbarService.setRetailer($scope.retailer.selected);
		$state.reload();
	}

	$scope.tagHandler = function (tag){
		return null;
	}

	function updateSelection(position, entitie) {
		angular.forEach(entitie, function(value, index) {
			if(position != index){
				value.checked = false;
			}
		});
	}

	function broadcastSearchPageReset(){
		$rootScope.$broadcast('resetSearchCurrentPage');
	}


});