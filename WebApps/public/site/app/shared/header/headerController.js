/**
* Header Controller
*/
'use strict';

app.controller('HeaderController', function ($scope, $location, $http, $rootScope, $state, AuthService, ModalService, SearchService, CartService, MenuService, FilterbarService) {
	//console.log("Header Controller reporting for duty.");

	$scope.cart = CartService;

	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};

	$scope.isAuthenticated = function (){
		if(AuthService.isAuthenticated()){
			$scope.user = AuthService.currentUser();
			return true;
		}
		return false;
	}

	$scope.loginForm = function(){
		ModalService.loginForm();
	};

	$scope.registerForm = function(){
		ModalService.registerForm();
	};


	$scope.logout = function(){
		AuthService.logout();
		$scope.user = null;
	};

	$scope.searchProduct = function(view){
		if($scope.searchterm){
			SearchService.setSearch($scope.searchterm);
			FilterbarService.clearCategoryAndBrand();
			MenuService.clearSubcategory();

			$state.go('search', {q: $scope.searchterm, brand:null,category:null,menuCategory:null,menuSubcategory:null}, { reload: true });
			$scope.searchterm = null;
		}else{


		}
	};

	$scope.notification = function(){
		jQuery('#notifications-menu').collapse('show');
	}

});