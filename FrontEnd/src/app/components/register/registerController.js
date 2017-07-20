/**
* Register Controller
*/
'use strict';

app.controller('RegisterController', function ($scope, $location, $http, $rootScope, $state, $auth, toastr) {
	console.log("Register Controller reporting for duty.");

	$scope.loginForm = function() {
		$rootScope.$emit("CallLoginForm", {});
	}

	$scope.register = function() {

		var user = {
			name: $scope.name,
			email: $scope.email,
			password: $scope.password
		}

		$auth.signup(user)
		.then(function(response) {
			$rootScope.$emit("CloseModalForm", {});
			AuthService.register(response,user.email);
		})
		.catch(function(response) {
			toastr.error(response.data);
		});
	};
});