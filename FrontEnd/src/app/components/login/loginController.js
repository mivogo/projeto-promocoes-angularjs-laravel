/**
* Login Controller
*/
'use strict';

app.controller('LoginController', function ($scope, $location, $http, $rootScope, $auth, $state, toastr, AuthService) {
	console.log("Login Controller reporting for duty.");

	$scope.registerForm = function() {
		$rootScope.$emit("CallRegisterForm", {});
	}


	$scope.login = function() {

		var credentials = {
			email: $scope.email,
			password: $scope.password
		}

        // Use Satellizer's $auth service to login
        $auth.login(credentials)
        .then(function() {
        	$rootScope.$emit("CloseModalForm", {});
            AuthService.login(credentials.email);

        })
        .catch(function(error) {
        	var str =" ";
        	if(error.data.email){
        		str+="\nEmail inválido ou não registado";
        	}
        	else{
        		str+="\nEmail ou password inválidos"
        	}
        	toastr.error(error.data, "Erro:");
        });
    }
});