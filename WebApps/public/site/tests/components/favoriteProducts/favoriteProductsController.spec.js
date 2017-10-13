describe('FavoriteProductsController', function() {
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

	beforeEach(function() {
		var favorite = {}
		var favoritesRequest = [favorite,favorite];

		scope = $rootScope.$new();
		controller = $controller('FavoriteProductsController', { $scope: scope, CartService: CartService, favoritesRequest: favoritesRequest});

	});

	describe('$scope.numberProducts', function() {
		it('has two favorites', function() {
			var result = scope.numberProducts();

			expect(result).toEqual(2);
		});

		it('has no favorites', function() {
			scope.favorites = [];

			var result = scope.numberProducts();

			expect(result).toEqual(0);
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

