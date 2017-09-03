/**
* Search Controller
*/
'use strict';

app.controller('SearchController', function ($scope, $location, $http, $window, $rootScope, $state, $filter, $stateParams, productRequest, FilterbarService, SearchService, ModalService, CartService, MenuService, Product) {
	//console.log("Search Controller reporting for duty.");

	$scope.cart = CartService;
	$scope.searchTerm = $stateParams.q;

	$scope.activeRetailer = FilterbarService.getRetailer().name;
	
	SearchService.clearUrl();
	SearchService.clearProductIds();

	MenuService.setSubcategory('');

	var products = productRequest.products;
	var brands = productRequest.brands;
	var categories = productRequest.categories;

	$scope.currentPage = products.current_page;
	$scope.nextPageUrl = products.next_page_url;
	$scope.prevPageUrl = products.prev_page_url;
	$scope.totalProducts = products.total;

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

	if(products.data.length>0){
		if(products.to == null){
			products.to = 1;
		}

		if(products.from == null){
			products.from = 1;
		}

		for (var i=0; i<(products.to-products.from)+1; i++) {
			var item = products.data[i];
			var product = Product.build(item);

			$scope.data.push(product);

		}
	}else{
		FilterbarService.clearCategoryListItems();
		FilterbarService.clearBrandListItems();
	}

	if(categories.length > 0){
		FilterbarService.clearCategoryListItems();
		angular.forEach(categories, function(value, key) {
			FilterbarService.addCategoryListItem({name:value});
		});
	}

	FilterbarService.setCategory('');
	FilterbarService.deselectCategories();

	if($stateParams.category){
		var category = $stateParams.category;

		FilterbarService.clearCategoryListItems();
		FilterbarService.addCategoryListItem({name: category, checked: true});
		FilterbarService.setCategory({name: category, checked: true});
	}

	if($stateParams.menuCategory){
		var category = $stateParams.menuCategory;
		category = category.replace(/-/g, ' ');

		FilterbarService.clearCategoryListItems();
		FilterbarService.addCategoryListItem({name: category, checked: true});
		FilterbarService.setCategory({name: category, checked: true});
	}


	if(brands.length > 0){
		FilterbarService.clearBrandListItems();
		angular.forEach(brands, function(value, key) {
			FilterbarService.addBrandListItem({name:value});
		});
	}

	FilterbarService.setBrand('');
	FilterbarService.deselectBrands();

	if($stateParams.brand){
		var brand = $stateParams.brand;

		
		FilterbarService.clearBrandListItems();
		FilterbarService.addBrandListItem({name: brand, checked: true});
		FilterbarService.setBrand({name: brand, checked: true});
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

	$scope.changeOrder = function(option){
		SearchService.selectedOrderOption = option;
		$state.reload();
	}

	$scope.changePageSize= function(value){
		SearchService.pageSize.value = value;
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

	function sortDropDownListByText(selectId) {
		var foption = $('#'+ selectId + ' option:first');
		var soptions = $('#'+ selectId + ' option:not(:first)').sort(function(a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		});
		$('#' + selectId).html(soptions).prepend(foption);              
	}


});