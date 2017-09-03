/**
* Shopping Lists Controller
*/

'use strict';

app.controller('ShoppingListsController', function ($scope, $state, CartService, ModalService, ProfileFactory, FilterbarService, shoppingListsRequest) {
	//console.log("Shopping Lists Controller reporting for duty.");

	var lists = shoppingListsRequest;

	$scope.cart = CartService;
	$scope.lists = [];

	angular.forEach(lists, function(data, key){
		$scope.lists.push(data);
	});

	$scope.numberLists = function(){
		return $scope.lists.length;
	}

	$scope.removeList = function(id){
		ProfileFactory.removeShoppingList(id)            
		.then(function (response) {
			$state.reload();
		}, function (error) {
			console.log('Unable to remove list: ' + error);
		});
	}

	$scope.modifyList = function(id){
		ProfileFactory.shoppingListProducts(id)            
		.then(function (response) {
			FilterbarService.setRetailerWithID(response.data.list.retailer_id);
			CartService.replaceCartWithList(response.data);
		}, function (error) {
			console.log('Unable to get shoppping list products: ' + error);
		});
	}

	$scope.viewList = function(id){
		ModalService.setShoppingListId(id);
		ModalService.shoppingListForm();
	}

});