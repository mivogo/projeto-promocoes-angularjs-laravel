describe('ProductSuggestionController', function() {
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

		spyOn(CartService, 'hasItem').and.callThrough();
		spyOn(CartService, 'replaceItemWithSuggestion').and.callThrough();

		CartService.addItem({id:1,product_id:1,price:2});
		CartService.addItem({id:6,product_id:6,price:2});
	});

	var scope, controller;
	var suggestionsRequest  = {product:{id:2,product_id:2},suggestions:[{id:5,product_id:5},{id:7,product_id:7}]};
	var replaceIndex = 1;

	beforeEach(function() {
		scope = $rootScope.$new();
		controller = $controller('ProductSuggestionController', { $scope: scope, CartService: CartService, replaceIndex:replaceIndex, suggestionsRequest: suggestionsRequest});

		spyOn(scope, 'replaceWithSuggestion').and.callFake(function(item) {
			CartService.replaceItemWithSuggestion(replaceIndex,item);
		});
	});

	describe('data initialized', function() {
		it('has product', function() {
			var result = scope.item;

			expect(result.id).toEqual(suggestionsRequest.product.id);
		});

		it('has suggestions', function() {
			expect(scope.suggestionsCount).toEqual(2);
		});
	});

	describe('$scope.productInCart', function() {
		it('product in cart', function() {
			var result = scope.productInCart({id:1,product_id:1});
			expect(CartService.hasItem).toHaveBeenCalled();

			expect(result).toEqual(true);
		});

		it('product not in cart', function() {
			var result = scope.productInCart(suggestionsRequest.product);
			expect(CartService.hasItem).toHaveBeenCalled();

			expect(result).toEqual(false);
		});
	});

	describe('$scope.replaceWithSuggestion', function() {
		it('product replaced', function() {
			var result = scope.productInCart(scope.suggestions[0]);
			expect(CartService.hasItem).toHaveBeenCalled();

			expect(result).toEqual(false);

			scope.replaceWithSuggestion(scope.suggestions[0]);
			expect(CartService.replaceItemWithSuggestion).toHaveBeenCalled();

			result = scope.productInCart(scope.suggestions[0]);
			expect(CartService.hasItem).toHaveBeenCalled();

			expect(result).toEqual(true);
		});
	});


});