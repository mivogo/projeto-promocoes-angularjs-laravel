describe('ProductController', function() {
	beforeEach(module('promocoesWebApp'));

	var $controller, $rootScope, CartService;


	beforeEach(inject(function(_$controller_, _$rootScope_, _CartService_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		CartService = _CartService_;
	}));

	beforeEach(function() {
		CartService.initRetailerCart(1);
		CartService.emptyCarts();

		spyOn(CartService, 'addItem').and.callFake(function(item) {
			var product = {
				id: item.id,
				product_id: item.product_id,
				price: item.price,
				total: 0,
				quantity: 1
			}
			CartService.getActiveCart().push(product);
		});

		spyOn(CartService, 'updateItemQuantity').and.callThrough();
		spyOn(CartService, 'hasItem').and.callThrough();
	});

	var scope, controller;
	var favoritesRequest = [{id:1,product_id:1},{id:2,product_id:2}];
	var productRequest = {product:{id:2,product_id:2},related:[{id:5,product_id:5}]};

	beforeEach(function() {
		scope = $rootScope.$new();
		controller = $controller('ProductController', { $scope: scope, CartService: CartService, favoritesRequest: favoritesRequest, productRequest});
	});

	describe('data initialized', function() {
		it('has product', function() {
			var result = scope.item;

			expect(result.id).toEqual(productRequest.product.id);
		});

		it('has favorites', function() {
			expect(scope.isFavorite(favoritesRequest[0].id)).toEqual(true);
			expect(scope.isFavorite(favoritesRequest[1].id)).toEqual(true);	
		});
	});

	describe('$scope.addProductToCart, $scope.updateProductQuantity and $scope.productInCart', function() {
		var item = {product_id:123, id:123,price:2};

		it('product added and quantity changed', function() {
			//add product and verify its added
			scope.addProductToCart(item);
			expect(CartService.addItem).toHaveBeenCalled();

			var result = scope.productInCart(item);
			expect(CartService.hasItem).toHaveBeenCalled();

			expect(result).toEqual(true);

			//change quantity
			scope.updateProductQuantity(item,5);
			expect(CartService.updateItemQuantity).toHaveBeenCalled();

			result = CartService.itemQuantity(item);

			expect(result).toEqual(6);
		});
	});
});


