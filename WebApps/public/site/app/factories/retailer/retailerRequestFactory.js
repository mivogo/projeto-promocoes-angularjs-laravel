'use strict';

app.factory('RetailerFactory', function($http, APIService) {

	var apiURL = APIService.apiUrl();
	var retailerFactory = {};

	retailerFactory.productAvailability = function (id) {
		return $http.post(apiURL + '/retailer/productAvailability/'+id);
	};

	retailerFactory.productSuggestions = function (prid,rid) {
		return $http.post(apiURL + '/retailer/productSuggestions/'+prid+'&rid='+rid);
	};

	retailerFactory.retailers = function () {
		return $http.get(apiURL + '/retailers');
	};

	return retailerFactory;
});
