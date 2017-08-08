/**
* Search Controller
*/
'use strict';

app.controller('SearchController', function ($scope, $location, $http, $window, $rootScope, $state, $filter, FilterbarService, SearchService, productRequest) {
	console.log("Search Controller reporting for duty.");

	SearchService.clearUrl();

	FilterbarService.clearBrandListItems();
	FilterbarService.clearCategoryListItems();

	$scope.currentPage = productRequest.current_page;
	$scope.nextPageUrl = productRequest.next_page_url;
	$scope.prevPageUrl = productRequest.prev_page_url;

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

	for (var i=0; i<(productRequest.to-productRequest.from)+1; i++) {
		var item = productRequest.data[i];
		$scope.data.push({
			id: item.id,
			product_id: item.product_id,
			name: item.name,
			price: item.price_weight,
			brand: item.brand,
			subcategory: item.subcategory,
			category: item.category,
			image: item.image,
			link: item.link
		});

		FilterbarService.addBrandListItem({brand:$scope.data[i].brand});
		FilterbarService.addCategoryListItem({category:$scope.data[i].category});
	}

	$scope.brandFilter = function(){
		return FilterbarService.getBrand();
	}

	$scope.categoryFilter = function(){
		return FilterbarService.getCategory();
	}

	$scope.numberOfPages = function(){
		return productRequest.last_page;                
	}

	$scope.openTab = function($link){
		$window.open($link, '_blank');
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
		$scope.currentPage = 0;
	}

	function sortDropDownListByText(selectId) {
		var foption = $('#'+ selectId + ' option:first');
		var soptions = $('#'+ selectId + ' option:not(:first)').sort(function(a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		});
		$('#' + selectId).html(soptions).prepend(foption);              
	}

});