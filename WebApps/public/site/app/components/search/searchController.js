/**
* Search Controller
*/
'use strict';

app.controller('SearchController', function ($scope, $location, $http, $window, $rootScope, $state, $filter, FilterbarService, SearchService, productRequest, ModalService, CartService) {
	console.log("Search Controller reporting for duty.");

	$scope.cart = CartService;

	SearchService.clearUrl();
	SearchService.clearProductIds();

	var products = productRequest.products;
	var brands = productRequest.brands;
	var categories = productRequest.categories;

	$scope.currentPage = products.current_page;
	$scope.nextPageUrl = products.next_page_url;
	$scope.prevPageUrl = products.prev_page_url;

	$scope.pageSize = {
		"type": "select", 
		"name": "pageSize",
		"value": SearchService.pageSize.value, 
		"values": SearchService.pageSize.values
	};

	$scope.data = [];
	$scope.q = '';

	$scope.orderOptions = SearchService.orderOptions;
	$scope.orderSelectedOption = SearchService.selectedOrderOption;

	if(products.to == null){
		products.to = 1;
	}

	if(products.from == null){
		products.from = 1;
	}

	for (var i=0; i<(products.to-products.from)+1; i++) {
		var item = products.data[i];
		$scope.data.push({
			id: item.id,
			product_id: item.product_id,
			name: item.name,
			price: item.price,
			price_weight: item.price_weight,
			price_weight_type: item.type_weight,
			weight: item.weight,
			weight_type: item.weight_type,
			hasDiscount: item.hasDiscount,
			base_price: item.base_price,
			brand: item.brand,
			subcategory: item.subcategory,
			category: item.category,
			image: item.image,
			link: item.link
		});


	}

	if(categories.length > 0){
		FilterbarService.clearCategoryListItems();
		angular.forEach(categories, function(value, key) {
			FilterbarService.addCategoryListItem({category:value});
		});
	}

	if(brands.length > 0){
		FilterbarService.clearBrandListItems();
		angular.forEach(brands, function(value, key) {
			FilterbarService.addBrandListItem({brand:value});
		});
	}


	$scope.brandFilter = function(){
		return FilterbarService.getBrand();
	}

	$scope.categoryFilter = function(){
		return FilterbarService.getCategory();
	}

	$scope.numberOfPages = function(){
		return products.last_page;                
	}

	$scope.productDetails = function(id,prid){
		SearchService.setProductId(id);
		SearchService.setProductRetailerId(prid);
		ModalService.productForm();
	}

	$scope.resetCurrentPage = function(){
		SearchService.pageSize.value = $scope.pageSize.value;
		SearchService.selectedOrderOption = $scope.orderSelectedOption;
		$state.reload();
	}

	$scope.previousPage = function(){
		SearchService.url = $scope.prevPageUrl;
		$state.reload();
	}

	$scope.nextPage = function(){
		SearchService.url = $scope.nextPageUrl;
		$state.reload();
	}

	$scope.$on('resetSearchCurrentPage', resetCurrentPage)

	function resetCurrentPage($event){
		$state.reload();
	}

	function sortDropDownListByText(selectId) {
		var foption = $('#'+ selectId + ' option:first');
		var soptions = $('#'+ selectId + ' option:not(:first)').sort(function(a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		});
		$('#' + selectId).html(soptions).prepend(foption);              
	}

});