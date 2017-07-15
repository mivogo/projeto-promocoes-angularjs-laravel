/**
* Header Controller
*/
app.controller('HeaderController', function ($scope, $location, $http, $uibModal, $rootScope) {
	
	console.log("Header Controller reporting for duty.");

	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};

	$rootScope.$on("CallRegisterForm", function(){
		$scope.modalInstance.close();
		$scope.registerForm();
	});

	$rootScope.$on("CallLoginForm", function(){
		$scope.modalInstance.close();
		$scope.loginForm();
	});

	$scope.loginForm = function(){
		modal = $uibModal.open({
			templateUrl: 'app/components/auth/authView.html',
			controller: 'AuthController'
		});

		$scope.modalInstance = modal;

		modal.result.then(function () {
            // Redirect to the logged-in area of your site
        }, function () {
            // optional function. Do something if the user cancels.
        });
	};

	$scope.registerForm = function(){
		modal = $uibModal.open({
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

	$scope.changeView = function(view){
		$location.path(view); // path not hash
		console.log("SEARCH TERM IN HEADER CTRL: "+$scope.search.term);
	};

});