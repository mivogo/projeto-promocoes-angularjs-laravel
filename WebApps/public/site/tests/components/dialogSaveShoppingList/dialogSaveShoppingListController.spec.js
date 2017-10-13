describe('DialogSaveShoppingListController', function() {
	beforeEach(module('promocoesWebApp'));

	var $controller, $rootScope, CartService;

	beforeEach(inject(function(_$controller_, _$rootScope_, _CartService_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		CartService = _CartService_;
	}));

	describe('$scope.name and $scope.description', function() {
		var scope, controller;

		var name = "testName";
		var description = "testDescription"

		beforeEach(function() {
			spyOn(CartService, 'getListName').and.callThrough();
			spyOn(CartService, 'getListDescription').and.callThrough();

			CartService.setListName(name);
			CartService.setListDescription(description);

			scope = $rootScope.$new();
			controller = $controller('DialogSaveShoppingListController', { $scope: scope });
		});

		it('name and description equal to service list name and description', function() {
			expect(scope.name).toEqual(name);
			expect(scope.description).toEqual(description);
		});

	});
});


