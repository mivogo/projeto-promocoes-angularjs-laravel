app.factory('ProductFactory', function($http, $auth) {

	var urlBase = 'http://localhost:8000/api/';
	var productFactory = {};

	productFactory.retailers= function () {
		return $http.get(urlBase + 'retailers');
	};

	productFactory.products= function (retailer) {
		return $http.get(urlBase + 'productsFromRetailer/'+retailer.id);
	};

	return productFactory;
});
