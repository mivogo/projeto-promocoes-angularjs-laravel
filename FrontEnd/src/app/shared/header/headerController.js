/**
* Header Controller
*/
'use strict';

app.controller('HeaderController', function ($scope, $location, $http, $uibModal, $rootScope, $state, AuthService) {
	
	//console.log("Header Controller reporting for duty.");

	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};

	$scope.isAuthenticated = function (){
		return AuthService.isAuthenticated();
	}

	$rootScope.$on("CallRegisterForm", function(){
		$scope.modalInstance.close();
		$scope.registerForm();
	});

	$rootScope.$on("CallLoginForm", function(){
		$scope.modalInstance.close();
		$scope.loginForm();
	});

	$rootScope.$on("CloseModalForm",function(){
		$scope.modalInstance.close();
	});

	$scope.loginForm = function(){
		var modal = $uibModal.open({
			allowAnonymous: true,
			templateUrl: 'app/components/login/loginView.html',
			controller: 'LoginController'
		});

		$scope.modalInstance = modal;

		modal.result.then(function () {
            $scope.user = AuthService.currentUser();
        }, function () {
            // optional function. Do something if the user cancels.
        });
	};

	$scope.registerForm = function(){
		var modal = $uibModal.open({
			allowAnonymous: true,
			templateUrl: 'app/components/register/registerView.html',
			controller: 'RegisterController'
		});

		$scope.modalInstance = modal;

		modal.result.then(function () {
            // Redirect to the logged-in area of your site
        }, function () {
            // optional function. Do something if the user cancels.
        });
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