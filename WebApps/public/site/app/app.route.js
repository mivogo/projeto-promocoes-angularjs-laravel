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


var categoriesRequest = function(ProductFactory, MenuService){
	return ProductFactory.categories()            
	.then(function (response) {
		var categories = response.data;
		MenuService.clearCategoryItems();

		angular.forEach(categories, function(item){
			MenuService.addCategoryItem(item);
		})

	}, function (error) {
		console.log('Unable to load subcategories data: ' + error);
	});
};


var retailerRequest = function(ProductFactory, FilterbarService){
	return 	ProductFactory.retailers()            
	.then(function (response) {
		var retailers = response.data;
		var first = true;
		FilterbarService.clearRetailerListItems();
		angular.forEach(retailers, function(item){
			item.img = 'site/assets/img/'+item.name+".svg";
			FilterbarService.addRetailerListItem(item);  
			if(first && !FilterbarService.retailer){
				FilterbarService.setRetailer(item);
			}
			first = false;
		})

	}, function (error) {
		console.log('Unable to load retailer data: ' + error);
	});
};

var productRequest = function($stateParams,ProductFactory){
	return 	ProductFactory.products($stateParams)            
	.then(function (response) {
		return response.data;
	}, function (error) {
		console.log('Unable to load product data: ' + error);
	});
};

var profileRequest = function(ProfileFactory){
	return ProfileFactory.getProfile()            
	.then(function (response) {
		return response.data;
	}, function (error) {
		console.log('Unable to load profile data: ' + error);
	});
};

var homeState = {
	name: 'home',
	url: '/',
	templateUrl: 'site/app/components/home/homeView.html',
	controller: 'HomeController',
	resolve: {
		retailerRequest: retailerRequest,
	}
}

var errorState = {
	name: 'error',
	url: '/404',
	templateUrl: 'site/app/components/404/404View.html',
	controller: '404Controller'
}

var searchState = {
	name: 'search',
	url: '/search/:menuCategory/:menuSubcategory?r&q&brand&category',
	params: {
		menuCategory: {
			value: null,
			squash: true
		},
		menuSubcategory: {
			value: null,
			squash: true
		}
	},
	templateUrl: 'site/app/components/search/searchView.html',
	controller: 'SearchController',
	resolve: {
		retailerRequest: retailerRequest,
		categoriesRequest: categoriesRequest,
		productRequest: productRequest,
		categoriesRequest: categoriesRequest,
	}
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

var cartState = {
	name: 'cart',
	url: '/cart',
	templateUrl: 'site/app/components/cart/cartView.html',
	controller: 'CartController'
}


$stateProvider.state(homeState);
$stateProvider.state(errorState);
$stateProvider.state(searchState);
$stateProvider.state(profileState);
$stateProvider.state(cartState);


});

