/**
* Register Controller
*/
'use strict';

app.controller('RegisterController', function ($scope, $rootScope, $auth, toastr, AuthService, ModalService) {
	console.log("Register Controller reporting for duty.");

	$scope.loginForm = function() {
		ModalService.CallLoginForm();
	}

	$scope.register = function() {

		var user = {
			name: $scope.name,
			email: $scope.email,
			password: $scope.password
		}

		$auth.signup(user)
		.then(function(response) {
			ModalService.CloseModalForm();
			AuthService.register(response.data);
		})
		.catch(function(error) {
			var str =" ";

			if(error.status <= 0){
				str+="\nOcorreu um erro na ligação ao servidor";
			}else{
				if(error.data.email){
					str+=error.data;
				}else{
					str+="\nEmail já se encontra registado";
				}
			}

			toastr.error(str, "Erro:");
		});
	};
});