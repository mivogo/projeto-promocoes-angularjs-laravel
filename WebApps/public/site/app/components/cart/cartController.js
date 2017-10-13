/**
* Cart Controller
*/

'use strict';

app.controller('CartController', function ($scope, $uibModal, SearchService, ModalService, FilterbarService, CartService, AuthService, PDFFactory) {
	//console.log("Cart Controller reporting for duty.");

	$scope.cart = CartService; 
	$scope.arrItems = CartService.getItems();
	$scope.activeRetailer = FilterbarService.getRetailer();


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
			<div class="dialog-buttons">\
			<a class="btn btn-primary" data-ng-click="modal.close()">Sim</a>\
			<a class="button-spacer"></a>\
			<a class="btn btn-default" data-ng-click="modal.dismiss()">Não</a>\
			</div>\
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

	$scope.hasSuggestions = function(item){
		for(var i = 0; i <item.suggestions.length; i++) {
			if(!CartService.hasItem(item.suggestions[i])){
				return true;
			}
		}
		return false;
	}

	$scope.suggestions = function(index,item){
		CartService.setProductRetailerId(item.data.id);
		ModalService.productSuggestionForm(index);
	}

	$scope.productDetails = function(id, prid){
		SearchService.setProductId(id);
		SearchService.setProductRetailerId(prid);
		ModalService.productForm();
	}


	$scope.createPDF = function(){
		var date = new Date();
		var dateFormat = date.getDate().toString()+(date.getMonth()+1).toString()+date.getFullYear().toString()+'_'+date.getHours().toString()+date.getMinutes().toString();

		var dd = PDFFactory.createProductListPDF($scope.arrItems,$scope.activeRetailer.name,$scope.cart.totalCost());
		pdfMake.createPdf(dd).download('PromoSite_ListaProdutos_'+$scope.activeRetailer.name+'_'+dateFormat+'.pdf');
	}

});