/**
* Password Controller
*/
'use strict';

app.controller('PasswordController', function ($scope, $location, $http, $rootScope, $state, $auth, toastr, AuthService, ModalService, AuthFactory) {
	//console.log("Password Controller reporting for duty.");

	$scope.changePassword = function() {
		var password = {
			password: $scope.newpassword
		}

		AuthFactory.changePassword(password)            
		.then(function (response) {
			ModalService.CloseModalForm();
			AuthService.logout();
			toastr.success('Password alterada com sucesso');
		}, function (error) {
			console.log('Unable to load profile data: ' + error);
		});
	};


});