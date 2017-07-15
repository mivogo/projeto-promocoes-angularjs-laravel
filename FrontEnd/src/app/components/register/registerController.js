/**
* Register Controller
*/
app.controller('RegisterController', function ($scope, $location, $http, $rootScope) {
	console.log("Register Controller reporting for duty.");

	$scope.loginForm = function() {
		$rootScope.$emit("CallLoginForm", {});
	}
});