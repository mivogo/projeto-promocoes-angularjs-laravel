app.factory('ProfileFactory', function($http, $auth) {

	var urlBase = 'http://localhost:8000/api/';
	var profileFactory = {};

	profileFactory.getProfile = function () {
		return $http.get(urlBase + 'details', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.updateProfile = function (profile) {
		return $http.post(urlBase + 'update', profile, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return profileFactory;
});