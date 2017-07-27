/**
* Routes Configuration
*/
'use strict';

app.config(function($locationProvider, $urlRouterProvider, $stateProvider, $authProvider) {

	$locationProvider.html5Mode({enabled:true});
	$authProvider.loginUrl = 'http://localhost:8000/api/login';
	$authProvider.signupUrl = 'http://localhost:8000/api/register';
	$urlRouterProvider.otherwise('/404');

/*
* Helper auth functions
*/
var skipIfLoggedIn = function($q, $auth) {
	var deferred = $q.defer();
	if ($auth.isAuthenticated()) {
		deferred.reject();
	} else {
		deferred.resolve();
	}
	return deferred.promise;
};

var loginRequired = function($q, $location, $auth, ModalService) {
	var deferred = $q.defer();
	if ($auth.isAuthenticated()) {
		deferred.resolve();
	} else {
		ModalService.CallRegisterForm();
	}
	return deferred.promise;
};

var profileRequest = function(ProfileFactory){
	return ProfileFactory.getProfile()            
	.then(function (response) {
		return response.data;
	}, function (error) {
		console.log('Unable to load profile data: ' + error);
	});
}

var homeState = {
	name: 'home',
	url: '/',
	templateUrl: 'site/app/components/home/homeView.html',
	controller: 'HomeController'
}

var errorState = {
	name: 'error',
	url: '/404',
	templateUrl: 'site/app/components/404/404View.html',
	controller: '404Controller'
}

var searchState = {
	name: 'search',
	url: '/search?q=:term',
	templateUrl: 'site/app/components/search/searchView.html',
	controller: 'SearchController'
}

var profileState = {
	name: 'profile',
	url: '/profile',
	templateUrl: 'site/app/components/profile/profileView.html',
	controller: 'ProfileController',
	resolve: {
		loginRequired: loginRequired,
		profileRequest: profileRequest,
	}
}


$stateProvider.state(homeState);
$stateProvider.state(errorState);
$stateProvider.state(searchState);
$stateProvider.state(profileState);
});

