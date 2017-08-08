'use strict';

app.factory('ProfileFactory', function($http, $auth, APIService) {

	var urlBase = APIService.apiUrl();
	var profileFactory = {};

	profileFactory.getProfile = function () {
		return $http.get(urlBase + '/details', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.updateProfile = function (profile) {
		return $http.post(urlBase + '/update', profile, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return profileFactory;
});