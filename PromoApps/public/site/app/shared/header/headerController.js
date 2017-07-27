/**
* Header Controller
*/
'use strict';

app.controller('HeaderController', function ($scope, $location, $http, $rootScope, $state, AuthService, ModalService) {
	
	//console.log("Header Controller reporting for duty.");

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

	$scope.changeView = function(view){
		if($scope.search.term){
			$state.go(view,{q: $scope.search.term});
		}else{

		}
	};

});