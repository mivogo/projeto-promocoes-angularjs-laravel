/**
* Cart Info Bar Controller
*/
'use strict';

app.controller('CartInfoBarController', function ($scope, $state, FilterbarService, CartService) {
	//console.log("Cart Info Bar Controller reporting for duty.");

	$scope.retailers = FilterbarService.getRetailersList();
	$scope.activeRetailer = FilterbarService.getRetailer();
	$scope.activeCart = CartService.getActiveCart();
	
	$scope.retailerTotalCost = function(id){
		return CartService.retailerTotalCost(id);
	}

	$scope.changeActiveRetailer = function(retailer){
		FilterbarService.setRetailer(retailer);
		$state.go('search', {}, { reload: true });
	}

	$scope.retailerHasUnavailableProducts = function(id){
		return CartService.hasUnavailableProducts(id);
	}
});