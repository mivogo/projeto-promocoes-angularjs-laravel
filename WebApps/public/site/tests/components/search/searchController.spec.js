describe('SearchController', function() {
	beforeEach(module('promocoesWebApp'));

	var $controller, $rootScope, CartService;


	beforeEach(inject(function(_$controller_, _$rootScope_, _CartService_, _SearchService_, _FilterbarService_, _ModalService_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		CartService = _CartService_;
		SearchService = _SearchService_;
		FilterbarService = _FilterbarService_;
		ModalService = _ModalService_;
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

	beforeEach(function() {
		spyOn(SearchService, 'orderOptionsList').and.callThrough();
		spyOn(SearchService, 'getSelectedOrderOption').and.callThrough();
		spyOn(SearchService, 'changeSelectedOrderOption').and.callThrough();
		spyOn(SearchService, 'changePageSizeValue').and.callThrough();
		spyOn(SearchService, 'changeNavigationUrl').and.callThrough();
		spyOn(SearchService, 'setProductId').and.callThrough();
		spyOn(SearchService, 'setProductRetailerId').and.callThrough();
	});

	beforeEach(function() {
		FilterbarService.addRetailerListItem({id:1,name:"Retailer"});
		FilterbarService.setRetailer({id:1,name:"Retailer"});
	});	

	beforeEach(function() {
		spyOn(ModalService, 'productForm').and.callThrough();
	});


	var scope, controller;

	beforeEach(function() {
		var productRequest = {
			products: {
				current_page:1, 
				next_page_url:"next_page",
				prev_page_url:"prev_page",
				data:[{product_id:1, id:1,price:2},{product_id:2, id:2,price:2}],
				total: 2,
				to: 1,
				from: 0,
				last_page: 1
			},
			brands: [{name: "Brand"}],
			categories: [{name: "Category"}],
		}

		scope = $rootScope.$new();
		controller = $controller('SearchController', { $scope: scope, productRequest: productRequest});

	});

	describe('$scope.numberOfPages', function() {
		it('should be 1', function() {
			var result = scope.numberOfPages();

			expect(result).toEqual(1);
		});
	});

	describe('$scope.productDetails', function() {
		it('values changed and form called', function() {
			scope.productDetails(123,123);
			expect(SearchService.setProductId).toHaveBeenCalled();
			expect(SearchService.setProductRetailerId).toHaveBeenCalled();

			expect(SearchService.getProductId()).toEqual(123);
			expect(SearchService.getProductRetailerId()).toEqual(123);

			expect(ModalService.productForm).toHaveBeenCalled();
		});

		it('values not changed and form not called', function() {
			scope.productDetails(null,null);
			expect(SearchService.setProductId).not.toHaveBeenCalled();
			expect(SearchService.setProductRetailerId).not.toHaveBeenCalled();
			expect(ModalService.productForm).not.toHaveBeenCalled();
		});

	});

	describe('$scope.changeOrder', function() {
		var defaultOption = { name: "Ordenar por Relevancia", value:"relevance"};
		var option = { name: "Ordenar por Marca", value:"brand"};
		it('order option changed', function() {
			expect(SearchService.getSelectedOrderOption()).toEqual(defaultOption);

			scope.changeOrder(option);
			expect(SearchService.changeSelectedOrderOption).toHaveBeenCalled();

			expect(SearchService.getSelectedOrderOption()).toEqual(option);
		});
	});

	describe('$scope.changePageSize', function() {
		var defaultValue = 16;
		it('page size value changed', function() {
			var value = scope.pageSize.values[2]; //32
			
			expect(defaultValue).not.toEqual(value);

			expect(SearchService.pageSizeValue()).toEqual(defaultValue);

			scope.changePageSize(value);
			expect(SearchService.changePageSizeValue).toHaveBeenCalled();

			expect(SearchService.pageSizeValue()).toEqual(value);
		});
	});


	describe('$scope.previousPage and $scope.nextPage', function() {
		it('navigation url should be equal to prev_page_url', function() {
			scope.previousPage();

			expect(SearchService.changeNavigationUrl).toHaveBeenCalled();

			expect(SearchService.getNavigationUrl()).toEqual(scope.prevPageUrl);
		});

		it('navigation url should be equal to next_page_url', function() {
			scope.nextPage();

			expect(SearchService.changeNavigationUrl).toHaveBeenCalled();

			expect(SearchService.getNavigationUrl()).toEqual(scope.nextPageUrl);
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

