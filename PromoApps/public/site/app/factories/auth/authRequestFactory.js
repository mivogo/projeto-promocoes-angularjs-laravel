app.factory('AuthFactory', function($http, $auth) {

	var urlBase = 'http://localhost:8000/api/';
	var authFactory = {};

	authFactory.changePassword = function (password) {
		return $http.post(urlBase + 'password', password, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return authFactory;
});
