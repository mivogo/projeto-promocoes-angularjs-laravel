/**
* Shopping Lists Controller
*/

'use strict';

app.controller('ShoppingListsController', function ($scope, $state, $uibModal, CartService, ModalService, ProfileFactory, FilterbarService, PDFFactory, shoppingListsRequest) {
	//console.log("Shopping Lists Controller reporting for duty.");

	var lists = shoppingListsRequest;

	$scope.cart = CartService;
	$scope.lists = [];

	angular.forEach(lists, function(data, key){
		$scope.lists.push(data);
	});

	$scope.numberLists = function(){
		return $scope.lists.length;
	}

	$scope.removeList = function(id){
		ProfileFactory.removeShoppingList(id)            
		.then(function (response) {
			$state.reload();
		}, function (error) {
			console.log('Unable to remove list: ' + error);
		});
	}

	$scope.modifyList = function(id){
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
				$scope.title = "Aviso";
				$scope.message = "A lista actual de produtos irá ser substituída pela lista seleccionada.\n\nDeseja continuar?"
			}});

		modal.result.then(function () {
			ProfileFactory.shoppingListProducts(id)            
			.then(function (response) {
				FilterbarService.setRetailerWithID(response.data.list.retailer_id);
				CartService.replaceCartWithList(response.data);
			}, function (error) {
				console.log('Unable to get shoppping list products: ' + error);
			});
		}, function () {

		});

	}

	$scope.viewList = function(id){
		ModalService.setShoppingListId(id);
		ModalService.shoppingListForm();
	}

	$scope.createPDF = function(id, total){
		ProfileFactory.shoppingListProducts(id)            
		.then(function (response) {
			var retailerName = FilterbarService.getRetailer().name;
			var list = response.data.list;
			var products = response.data.products;
			console.log(list);
			console.log(products);
			var date = new Date();
			var dateFormat = date.getDate().toString()+(date.getMonth()+1).toString()+date.getFullYear().toString()+'_'+date.getHours().toString()+date.getMinutes().toString();

			var dd = PDFFactory.createSavedListPDF(list,products,retailerName,total);
			pdfMake.createPdf(dd).download('PromoSite_'+list.name.replace(/ /g, '_')+'_'+retailerName+'_'+dateFormat+'.pdf');

		}, function (error) {
			console.log('Unable to get shoppping list products: ' + error);
		});
	}

});