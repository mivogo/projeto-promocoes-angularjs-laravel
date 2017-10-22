/**
* Home Controller
*/

'use strict';

app.controller('HomeController', function ($scope, ModalService) {
	//console.log("Home Controller reporting for duty.");

	$scope.registerForm = function(){
		ModalService.registerForm();
	};
});