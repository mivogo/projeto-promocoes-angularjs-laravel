'use strict';

app.factory('ProductFactory', function($http, $auth, FilterbarService, SearchService, APIService) {

	var urlBase = APIService.apiUrl();
	var productFactory = {};

	productFactory.retailers = function () {
		return $http.get(urlBase + '/retailers');
	};

	productFactory.products = function () {
		var rid = FilterbarService.retailer.id;
		var url = SearchService.url;
		var request = buildRequest();

		if(url){
			return $http.post(url, request);
		}

		return $http.post(urlBase+'/productsFromRetailer/'+rid,request);
	};

	productFactory.product = function (pid,prid) {
		return $http.get(urlBase + '/products/'+pid+'&pr='+prid);
	};

	function buildRequest(){
		var orderby = SearchService.selectedOrderOption.value;
		var pageSize = SearchService.pageSize.value;
		var search = SearchService.search;
		var brand = FilterbarService.brand;
		var category = FilterbarService.category;

		var request = {
			search: search,
			order: orderby,
			item_amount: pageSize,
			brand: brand,
			category: category
		}

		return request;
	}

	return productFactory;
});
