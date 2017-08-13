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
		var search = SearchService.getSearch();
		var brand = FilterbarService.getBrand().name;
		var category = FilterbarService.getCategory().name;
		var subcategory = MenuService.getSubcategory();

		if(!search && param.q){
			search = param.q;
		}

		if(!brand && param.brand){
			brand = param.brand;
		}

		if(!category && param.category){
			category = param.category;
		}

		if(!category && param.menuCategory){
			category = param.menuCategory;
		}

		if(!subcategory && param.menuSubategory){
			subcategory = param.menuSubategory;
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
