'use strict';

app.factory('ProductFactory', function($http, $auth, FilterbarService, SearchService, APIService, MenuService) {

	var urlBase = APIService.apiUrl();
	var productFactory = {};

	productFactory.retailers = function () {
		return $http.get(urlBase + '/retailers');
	};

	productFactory.categories = function () {
		return $http.get(urlBase + '/categories');
	};

	productFactory.products = function (param) {

		var rid = FilterbarService.retailer.id;
		var url = SearchService.url;
		var request = buildRequest(param);

		if(url){
			return $http.post(url, request);
		}

		return $http.post(urlBase+'/productsFromRetailer/'+rid,request);
	};

	productFactory.product = function (pid,prid) {
		return $http.get(urlBase + '/products/'+pid+'&pr='+prid);
	};

	function buildRequest(param){

		var orderby = SearchService.selectedOrderOption.value;
		var pageSize = SearchService.pageSize.value;
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
			subcategory = param.menuSubcategory.replace(/-/g, ' ');;
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
