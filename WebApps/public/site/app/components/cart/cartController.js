/**
* Cart Controller
*/

'use strict';

app.controller('CartController', function ($scope, $location, $http, ModalService, CartService, AuthService, ngCart) {
	console.log("Cart Controller reporting for duty.");

	$scope.ngCart = ngCart; 

	$scope.saveList = function(){
		if(AuthService.isAuthenticated()){
			ModalService.saveShoppingListForm();
		}else{
			ModalService.loginForm();
		}
	}	

	$scope.$on('ngCart:change', function(){
		if(ngCart.getTotalItems() === 0){
			CartService.setListName('');
			CartService.setListDescription('');
		}
	});
});