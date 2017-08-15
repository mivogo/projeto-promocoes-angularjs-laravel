/**
* Shopping Lists Controller
*/

'use strict';

app.controller('ShoppingListsController', function ($scope, $state, CartService, ProfileFactory, shoppingListsRequest) {
	console.log("Shopping Lists Controller reporting for duty.");

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
});