'use strict';

app.factory('AuthFactory', function($http, $auth, APIService) {

	var apiURL = APIService.apiUrl();
	var authFactory = {};

	authFactory.changePassword = function (password) {
		return $http.post(apiURL + '/password', password, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return authFactory;
});
