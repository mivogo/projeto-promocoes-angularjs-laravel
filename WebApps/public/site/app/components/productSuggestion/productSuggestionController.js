/**
* Product Suggestion Controller
*/

'use strict';

app.controller('ProductSuggestionController', function ($scope, $uibModal, $state, CartService, ModalService, Product, replaceIndex, suggestionsRequest) {
	//console.log("Product Suggestion Controller reporting for duty.");
	
	var suggestionsList = suggestionsRequest.suggestions;
	var data = suggestionsRequest.product;

	$scope.suggestions = [];
	$scope.suggestionsCount = 0;
	$scope.item = Product.build(data);

	angular.forEach(suggestionsList, function(item){
		if(!CartService.hasItem(item)){
			var product = Product.build(item);
			$scope.suggestions.push(product);
		}
		$scope.suggestionsCount +=1;
	});

	$scope.productInCart = function (item){
		return CartService.hasItem(item);
	}

	$scope.replaceWithSuggestion = function(item){
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
				$scope.title = "Aviso";
				$scope.message = "Deseja trocar o produto pelo seleccionado?"
			}});

		modal.result.then(function () {
			CartService.replaceItemWithSuggestion(replaceIndex,item);
			ModalService.CloseModalForm();
		}, function () {

		});
	}

});