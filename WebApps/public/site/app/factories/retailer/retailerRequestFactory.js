'use strict';

app.factory('RetailerFactory', function($http, APIService) {

	var urlBase = APIService.apiUrl();
	var retailerFactory = {};

	retailerFactory.productAvailability = function (id) {
		return $http.post(urlBase + '/retailer/productAvailability/'+id);
	};

	retailerFactory.productSuggestions = function (prid,rid) {
		return $http.post(urlBase + '/retailer/productSuggestions/'+prid+'&rid='+rid);
	};

	return retailerFactory;
});
