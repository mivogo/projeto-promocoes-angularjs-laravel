/**
* Product Controller
*/
'use strict';

app.controller('ProductController', function ($scope, $state, CartService, ModalService, SearchService, FilterbarService, AuthService, ProfileFactory, favoritesRequest, productRequest, Product) {
	//console.log("Product Controller reporting for duty.");

	var data = productRequest.product;
	var related = productRequest.related;
	var dataFavorites = favoritesRequest;
	var favorites = [];
	
	$scope.cart = CartService;
	$scope.item = Product.build(data);
	$scope.related = [];
	$scope.relatedCount = 0;
	$scope.retailerPrices = [];


	angular.forEach(related, function(data, key){
		var product = Product.build(data);
		$scope.related.push(product);

		$scope.relatedCount +=1;
	});

	angular.forEach(data.retailers_prices, function(value, key){
		var retailer = FilterbarService.getRetailerWithId(value.retailer_id);
		$scope.retailerPrices.push({retailer:retailer,price:value.price,base_price:value.base_price,hasDiscount:value.hasDiscount});
	});

	if(dataFavorites){
		angular.forEach(dataFavorites, function(data, key){
			favorites.push(data.id);
		});
	}

	$scope.addFavorite = function (id){
		if(AuthService.isAuthenticated()){
			ProfileFactory.addFavoriteProduct(id)
			.then(function (response) {
				favorites.push(id);
			}, function (error) {

			});
		}else{
			ModalService.loginForm();
		}
	}

	$scope.removeFavorite = function (id){
		ProfileFactory.removeFavoriteProduct(id)
		.then(function (response) {
			var index = favorites.indexOf(id);
			favorites.splice(index, 1);
		}, function (error) {

		});
	}

	$scope.isFavorite = function (id){
		return favorites.indexOf(id) !== -1;
	}

	$scope.productDetails = function(id, prid){
		SearchService.setProductId(id);
		SearchService.setProductRetailerId(prid);
		ModalService.productForm();
	}
	
	$scope.addProductToCart = function(item){
		CartService.addItem(item);
	}

	$scope.updateProductQuantity = function(item, qt){
		CartService.updateItemQuantity(item,qt);
	}

	$scope.productInCart = function (item){
		return CartService.hasItem(item);
	}
});