'use strict';

app.factory('RetailerFactory', function($http, APIService) {

	var urlBase = APIService.apiUrl();
	var retailerFactory = {};

	retailerFactory.productAvailability = function (id) {
		return $http.post(urlBase + '/retailer/productAvailability/'+id);
	};

	return retailerFactory;
});
