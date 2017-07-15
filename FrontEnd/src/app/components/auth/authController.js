/**
* Auth Controller
*/
app.controller('AuthController', function ($scope, $location, $http, $rootScope) {
	console.log("Auth Controller reporting for duty.");

	$scope.registerForm = function() {
		$rootScope.$emit("CallRegisterForm", {});
	}
});