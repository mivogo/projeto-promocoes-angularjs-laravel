/**
* Routes Configuration
*/
'use strict';

app.config(function($locationProvider, $urlRouterProvider, $stateProvider,$authProvider) {
	$locationProvider.html5Mode({enabled:true});
	$authProvider.loginUrl = 'http://localhost:8000/api/login';
	$authProvider.signupUrl = 'http://localhost:8000/api/register';
	$urlRouterProvider.otherwise('/404');


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

	$stateProvider.state(homeState);
	$stateProvider.state(errorState);
	$stateProvider.state(searchState);
});

