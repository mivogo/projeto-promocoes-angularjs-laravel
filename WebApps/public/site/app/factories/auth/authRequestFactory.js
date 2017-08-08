'use strict';

app.factory('AuthFactory', function($http, $auth, APIService) {

	var urlBase = APIService.apiUrl();
	var authFactory = {};

	authFactory.changePassword = function (password) {
		return $http.post(urlBase + '/password', password, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return authFactory;
});
