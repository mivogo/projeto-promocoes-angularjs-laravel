/**
* Favorite Products Controller
*/

'use strict';

app.controller('FavoriteProductsController', function ($scope, $state, Product, CartService, ProfileFactory, favoritesRequest) {
	//console.log("Favorite Products Controller reporting for duty.");

	var favorites = favoritesRequest;

	$scope.cart = CartService;
	$scope.favorites = [];

	angular.forEach(favorites, function(data, key){
		var product = Product.build(data);

		$scope.favorites.push(product);
	});

	$scope.removeFavorite = function(id){
		ProfileFactory.removeFavoriteProduct(id)            
		.then(function (response) {
			$state.reload();
		}, function (error) {
			console.log('Unable to remove favorite product: ' + error);
		});
	}

});