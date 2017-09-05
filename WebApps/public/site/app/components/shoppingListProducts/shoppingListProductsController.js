/**
* Shopping List Products Controller
*/

'use strict';

app.controller('ShoppingListProductsController', function ($scope, $state, CartService, ModalService, ProfileFactory, shoppingListProductsRequest) {
	//console.log("Shopping List Products Controller reporting for duty.");
	

	var products = shoppingListProductsRequest.products;
	var list = shoppingListProductsRequest.list;

	$scope.listName = list.name;
	$scope.listDescription = list.description;
	$scope.products = [];

	angular.forEach(products, function(data, key){
		$scope.products.push(data);
	});
});