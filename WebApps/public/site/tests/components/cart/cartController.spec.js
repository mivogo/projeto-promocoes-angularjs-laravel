describe('CartController', function() {
	beforeEach(module('promocoesWebApp'));

	var $controller, $rootScope, CartService;

	beforeEach(inject(function(_$controller_, _$rootScope_, _CartService_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		CartService = _CartService_;
	}));

	describe('$scope.hasSuggestions', function() {
		var scope, controller;

		beforeEach(function() {
			scope = $rootScope.$new();
			controller = $controller('CartController', { $scope: scope });
		});

		it('returns false if item has no suggestions', function() {
			var item = {suggestions:[]};

			var result = scope.hasSuggestions(item);

			expect(result).toEqual(false);
		});

		it('returns true if item has suggestions', function() {
			var suggestion = {};
			var item = {suggestions:[suggestion]};

			var result = scope.hasSuggestions(item);

			expect(result).toEqual(true);
		});

		it('returns false if item has suggestion but the product suggested is already added', function() {
			var suggestion = {product_id:123, id:123};

			CartService.initRetailerCart(1);
			CartService.addItem(suggestion);
			CartService.getActiveCart().push(suggestion);

			expect(scope.cart.hasItem(suggestion)).toEqual(true);

			var item = {suggestions:[suggestion]};
			var result = scope.hasSuggestions(item);

			expect(result).toEqual(false);
		});
	});
});



