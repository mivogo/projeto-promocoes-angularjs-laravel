/**
* Favorite Products Controller
*/

'use strict';

app.controller('FavoriteProductsController', function ($scope, $state, Product, CartService, FilterbarService, ProfileFactory, favoritesRequest) {
	//console.log("Favorite Products Controller reporting for duty.");

	var dataFavorites = favoritesRequest;
	var i = 0;
	
	$scope.cart = CartService;
	$scope.favorites = [];
	$scope.activeRetailer = FilterbarService.getRetailer();

	angular.forEach(dataFavorites, function(data, key){
		var product = Product.build(data);

		$scope.favorites.push(product);

		$scope.favorites[i].retailerPrices = [];

		angular.forEach(data.retailers_prices, function(value, key){
			var retailer = FilterbarService.getRetailerWithId(value.retailer_id);
			console.log(FilterbarService.getRetailerWithId(value.retailer_id));
			$scope.favorites[i].retailerPrices.push({retailer:retailer,price:value.price,base_price:value.base_price,hasDiscount:value.hasDiscount});
		});

		i = i+1;
	});

	$scope.numberProducts = function(){
		return $scope.favorites.length;
	}

	$scope.removeFavorite = function(id){
		ProfileFactory.removeFavoriteProduct(id)            
		.then(function (response) {
			$state.reload();
		}, function (error) {
			console.log('Unable to remove favorite product: ' + error);
		});
	}

});