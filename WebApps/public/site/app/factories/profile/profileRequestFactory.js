'use strict';

app.factory('ProfileFactory', function($http, $auth, APIService) {

	var apiURL = APIService.apiUrl();
	var profileFactory = {};

	profileFactory.getProfile = function () {
		return $http.get(apiURL + '/details', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.updateProfile = function (profile) {
		return $http.post(apiURL + '/update', profile, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.favoriteProducts = function () {
		return $http.get(apiURL + '/profile/favorites', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.addFavoriteProduct = function (id) {
		return $http.post(apiURL + '/profile/favorites/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.removeFavoriteProduct = function (id) {
		return $http.delete(apiURL + '/profile/favorites/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppingLists = function () {
		return $http.get(apiURL + '/profile/shoppinglist', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.removeShoppingList = function (id) {
		return $http.delete(apiURL + '/profile/shoppinglist/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppingListProducts = function (id) {
		return $http.post(apiURL + '/profile/shoppinglist/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.shoppinglistNameTaken = function(name) {
		return $http.post(apiURL + '/profile/shoppinglist/nameTaken', name, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.saveShoppingList = function(list) {
		return $http.post(apiURL + '/profile/shoppinglist', list, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.notifications = function() {
		return $http.get(apiURL + '/profile/notification', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.notificationsNotRead = function() {
		return $http.get(apiURL + '/profile/notificationNotRead', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.markNotification = function(id) {
		return $http.post(apiURL + '/profile/notification/'+id, {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	profileFactory.markAllNotifications = function() {
		return $http.post(apiURL + '/profile/notificationMarkAll', {
			headers: {'Authorization': 'Bearer ' + $auth.getToken()}
		});
	};

	return profileFactory;
});