/**
* Cart Controller
*/

'use strict';

app.controller('CartController', function ($scope, $uibModal, ModalService, CartService, AuthService) {
	console.log("Cart Controller reporting for duty.");

	var updateCart = function(){
		if(CartService.getTotalItems() === 0){
			CartService.setListName('');
			CartService.setListDescription('');
		}
	};

	CartService.registerObserverCallback(updateCart);

	$scope.cart = CartService; 

	$scope.saveList = function(){
		if(AuthService.isAuthenticated()){
			ModalService.saveShoppingListForm();
		}else{
			ModalService.loginForm();
		}
	}	

	$scope.clearList = function(){
		var modal = $uibModal.open({
			size: 'sm',
			template: '<div class="modal-header">\
			<h3 data-ng-bind="title"></h3>\
			</div>\
			<div class="modal-body" >\
			<p class="message" data-ng-bind="message">\
			</div>\
			<div class="modal-footer">\
			<button class="btn btn-primary" data-ng-click="modal.close()">Sim</button>\
			<button class="btn btn-default" data-ng-click="modal.dismiss()">Não</button>\
			</div>',
			controller: function ($scope, $uibModalInstance) {
				$scope.modal = $uibModalInstance;
				$scope.title = "Confirmação";
				$scope.message = "Deseja eliminar a lista de produtos?"
			}});

		modal.result.then(function () {
			CartService.emptyCarts();
		}, function () {

		});
	}	

});