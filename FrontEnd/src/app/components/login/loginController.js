/**
* Login Controller
*/
'use strict';

app.controller('LoginController', function ($scope, $location, $http, $rootScope, $auth, $state, toastr, AuthService, ModalService) {
	console.log("Login Controller reporting for duty.");

	$scope.registerForm = function() {
		ModalService.CallRegisterForm();
	}

	$scope.login = function() {

		var credentials = {
			email: $scope.email,
			password: $scope.password
		}

        // Use Satellizer's $auth service to login
        $auth.login(credentials)
        .then(function(response) {
        	ModalService.CloseModalForm();
            AuthService.login(response.data);
        })
        .catch(function(error) {
        	var str =" ";

            if(error.status <= 0){
                str+="\nOcorreu um erro na ligação ao servidor";
            }else{
                if(error.data.email){
                  str+="\nEmail inválido ou não registado";
                }else{
                  str+="\nEmail ou password inválidos";
                }
            }

          toastr.error(str, "Erro:");
      });
    }
});