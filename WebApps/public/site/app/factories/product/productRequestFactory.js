'use strict';

app.factory('ProductFactory', function($http, $auth, FilterbarService, SearchService, APIService, MenuService) {

	var apiURL = APIService.apiUrl();
	var productFactory = {};

	productFactory.categories = function () {
		return $http.get(apiURL + '/categories');
	};

	productFactory.products = function (param) {

		var rid = FilterbarService.getRetailer().id;
		var url = SearchService.getNavigationUrl();
		var request = buildRequest(param);

		if(url){
			return $http.post(url, request);
		}

		return $http.post(apiURL + '/productsFromRetailer/' + rid, request);
	};

	productFactory.product = function (pid,prid) {
		return $http.get(apiURL + '/products/' + pid + '&pr=' + prid);
	};

	function buildRequest(param){

		var orderby = SearchService.getSelectedOrderOption().value;
		var pageSize = SearchService.pageSizeValue();
		var search;
		var brand;
		var category
		var subcategory;

		if(param.q){
			search = param.q;
		}

		if(param.brand){
			brand = param.brand;
		}

		if(param.category){
			category = param.category;
		}

		if(param.menuCategory){
			category = param.menuCategory.replace(/-/g, ' ');
		}

		if(param.menuSubcategory){
			subcategory = param.menuSubcategory.replace(/-/g, ' ');
		}

		var request = {
			search: search,
			order: orderby,
			item_amount: pageSize,
			brand: brand,
			category: category,
			subcategory: subcategory
		}

		return request;
	}

	return productFactory;
});
