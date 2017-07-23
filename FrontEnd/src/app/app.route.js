/**
* Routes Configuration
*/
'use strict';

app.config(function($locationProvider, $urlRouterProvider, $stateProvider,$authProvider) {

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

var loginRequired = function($q, $location, $auth) {
	var deferred = $q.defer();
	if ($auth.isAuthenticated()) {
		deferred.resolve();
	} else {
		//
	}
	return deferred.promise;
};

var homeState = {
	name: 'home',
	url: '/',
	templateUrl: 'app/components/home/homeView.html',
	controller: 'HomeController'
}

var errorState = {
	name: 'error',
	url: '/404',
	templateUrl: 'app/components/404/404View.html',
	controller: '404Controller'
}

var searchState = {
	name: 'search',
	url: '/search?q=:term',
	templateUrl: 'app/components/search/searchView.html',
	controller: 'SearchController'
}

var profileState = {
	name: 'profile',
	url: '/profile',
	templateUrl: 'app/components/profile/profileView.html',
	controller: 'ProfileController',
	resolve: {
		loginRequired: loginRequired
	}
}

$stateProvider.state(homeState);
$stateProvider.state(errorState);
$stateProvider.state(searchState);
$stateProvider.state(profileState);
});

