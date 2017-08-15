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

	profileFactory.favoriteProducts = function () {
		return $http.get(urlBase + '/profile/favorites', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.addFavoriteProduct = function (id) {
		return $http.post(urlBase + '/profile/favorites/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.removeFavoriteProduct = function (id) {
		return $http.post(urlBase + '/profile/favorites/delete/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppingLists = function () {
		return $http.get(urlBase + '/profile/shoppinglist', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.removeShoppingList = function (id) {
		return $http.post(urlBase + '/profile/shoppinglist/delete/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppingListProducts = function (id) {
		return $http.post(urlBase + '/profile/shoppinglist/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppinglistNameTaken = function(name) {
		return $http.post(urlBase + '/profile/shoppinglist/nameTaken', name, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

		profileFactory.saveShoppingList = function(list) {
		return $http.post(urlBase + '/profile/shoppinglist', list, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};



	return profileFactory;
});