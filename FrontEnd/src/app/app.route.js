/**
* Routes Configuration
*/
app.config(function($locationProvider, $stateProvider) {
	$locationProvider.html5Mode({enabled:true});
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

